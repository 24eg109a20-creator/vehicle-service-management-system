#!/usr/bin/env bash
# ==============================================================================
# Online Launcher for Vehicle Records Management Application
# Connects Spring Boot Backend + React Frontend into a unified service
# and exposes it to the public internet (Not Localhost!)
# ==============================================================================

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export JAVA_HOME="/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home"
export PATH="$JAVA_HOME/bin:/usr/local/bin:$PATH"

echo "=================================================================="
echo " 🌐 Launching Vehicle Records Management System Online"
echo "=================================================================="

# Function to find local Wi-Fi IP
get_local_ip() {
    ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "127.0.0.1"
}
LOCAL_IP=$(get_local_ip)

# Cleanup on exit
cleanup() {
    echo ""
    echo "=================================================================="
    echo " Shutting down online services..."
    echo "=================================================================="
    if [ -n "$CF_PID" ]; then
        kill "$CF_PID" 2>/dev/null || true
    fi
    if [ -n "$LT_PID" ]; then
        kill "$LT_PID" 2>/dev/null || true
    fi
    if [ -n "$BACKEND_PID" ]; then
        kill "$BACKEND_PID" 2>/dev/null || true
    fi
    # Cleanup any stray cloudflared or localtunnel started by this script
    pkill -f "cloudflared tunnel.*8080" 2>/dev/null || true
    pkill -f "localtunnel.*8080" 2>/dev/null || true
    echo "All online services stopped."
    exit 0
}

trap cleanup INT TERM EXIT

# 1. Check MySQL Connectivity
echo "[1/4] Checking MySQL Database connection on port 3306..."
if nc -z 127.0.0.1 3306 2>/dev/null; then
    echo "      ✓ MySQL is reachable on port 3306 (vehicle_db)."
else
    echo "      ⚠ Warning: MySQL not detected on port 3306. Ensure MySQL is running."
fi

# 2. Build Frontend into Spring Boot static resources
echo "[2/4] Connecting & Building React Frontend into Spring Boot static assets..."
cd "$DIR/frontend"
npm run build --silent
mkdir -p "$DIR/backend/src/main/resources/static"
cp -r dist/* "$DIR/backend/src/main/resources/static/"
echo "      ✓ Frontend compiled and copied into backend/src/main/resources/static"

# Repackage Spring Boot JAR if needed
cd "$DIR/backend"
if [ ! -f "target/vehicle-svc-0.0.1-SNAPSHOT.jar" ] || [ "src/main/resources/static/index.html" -nt "target/vehicle-svc-0.0.1-SNAPSHOT.jar" ]; then
    echo "      Packing updated frontend into Spring Boot JAR..."
    ./mvnw package -DskipTests --quiet
    echo "      ✓ Spring Boot JAR updated with frontend assets."
fi

# 3. Start Spring Boot Unified Server (Port 8080)
echo "[3/4] Starting Spring Boot Full-Stack Service (Port 8080)..."
# Kill any existing process on 8080
lsof -ti :8080 | xargs kill -9 2>/dev/null || true
sleep 1

cd "$DIR"
java -jar backend/target/vehicle-svc-0.0.1-SNAPSHOT.jar > "$DIR/backend.log" 2>&1 &
BACKEND_PID=$!
echo "      ✓ Spring Boot started (PID: $BACKEND_PID). Logs: backend.log"

# Wait for backend readiness
echo -n "      Waiting for service to become ready..."
READY=false
for i in {1..30}; do
    if curl -s http://127.0.0.1:8080/api/vehicles/summary > /dev/null 2>&1; then
        READY=true
        echo " Ready!"
        break
    fi
    echo -n "."
    sleep 1
done

if [ "$READY" = false ]; then
    echo ""
    echo "❌ Failed to start Spring Boot service within 30 seconds."
    echo "Check backend.log for details:"
    tail -n 20 "$DIR/backend.log"
    exit 1
fi

# 4. Create Public Internet Tunnel
echo "[4/4] Establishing secure public HTTPS tunnel to internet..."
> "$DIR/tunnel.log"

CLOUDFLARE_URL=""
LOCALTUNNEL_URL=""

# Priority 1: Cloudflare Tunnel (fast, no passwords, standard HTTPS)
if [ -x "$DIR/bin/cloudflared" ]; then
    echo "      Starting Cloudflare Tunnel (HTTP/2)..."
    "$DIR/bin/cloudflared" tunnel --protocol http2 --url http://127.0.0.1:8080 > "$DIR/tunnel.log" 2>&1 &
    CF_PID=$!
    
    for i in {1..15}; do
        FOUND_CF=$(grep -oE 'https://[a-zA-Z0-9-]+\.trycloudflare\.com' "$DIR/tunnel.log" | head -n 1 || true)
        if [ -n "$FOUND_CF" ]; then
            CLOUDFLARE_URL="$FOUND_CF"
            break
        fi
        sleep 1
    done
fi

# Priority 2: Fallback to Localtunnel if Cloudflare didn't acquire URL
if [ -z "$CLOUDFLARE_URL" ]; then
    echo "      Starting Localtunnel fallback..."
    > "$DIR/localtunnel.log"
    npx -y localtunnel --port 8080 > "$DIR/localtunnel.log" 2>&1 &
    LT_PID=$!
    
    for i in {1..15}; do
        FOUND_LT=$(grep -oE 'https://[a-zA-Z0-9-]+\.loca\.lt' "$DIR/localtunnel.log" | head -n 1 || true)
        if [ -n "$FOUND_LT" ]; then
            LOCALTUNNEL_URL="$FOUND_LT"
            break
        fi
        sleep 1
    done
    TUNNEL_PASSWORD=$(curl -s --max-time 3 https://loca.lt/mytunnelpassword 2>/dev/null || echo "")
fi

MAIN_PUBLIC_URL="${CLOUDFLARE_URL:-$LOCALTUNNEL_URL}"

# Give Cloudflare edge a brief moment to stabilize
if [ -n "$CLOUDFLARE_URL" ]; then
    sleep 3
fi

echo ""
echo "=================================================================="
echo " 🎉 YOUR WEBSITE IS NOW LIVE ONLINE (NOT LOCALHOST)!"
echo "=================================================================="
if [ -n "$MAIN_PUBLIC_URL" ]; then
    echo " 🌐 Public Internet URL:  $MAIN_PUBLIC_URL"
    if [ -n "$LOCALTUNNEL_URL" ] && [ -n "$TUNNEL_PASSWORD" ]; then
        echo "    ↳ Tunnel Password (if prompted): $TUNNEL_PASSWORD"
    fi
    echo " 📖 Online Swagger UI:    $MAIN_PUBLIC_URL/swagger-ui.html"
    echo " 🔌 Online REST API:      $MAIN_PUBLIC_URL/api/vehicles"
else
    echo " ⚠ Tunnel URL connecting in background (check tunnel.log)."
fi
echo " ----------------------------------------------------------------"
echo " 📱 Local Wi-Fi (LAN) URL: http://${LOCAL_IP}:8080"
echo " 💻 Localhost URL:         http://localhost:8080"
echo "=================================================================="
echo " • Frontend + Backend are connected and running in one Spring Boot service."
echo " • Anyone on your Wi-Fi can open: http://${LOCAL_IP}:8080 immediately!"
echo " • Anyone on the internet can open: $MAIN_PUBLIC_URL"
echo " • Press Ctrl+C at any time to safely stop all services."
echo "=================================================================="
echo ""

# Keep running
wait
