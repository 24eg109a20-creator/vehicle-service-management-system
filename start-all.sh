#!/usr/bin/env bash
# ==============================================================================
# Unified Launcher Script for Vehicle Records Management Application
# Starts both Spring Boot backend (port 8080) and React frontend (port 3000)
# ==============================================================================

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export JAVA_HOME="/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home"
export PATH="$JAVA_HOME/bin:/usr/local/bin:$PATH"

echo "=========================================================="
echo " Starting Vehicle Records Management Application"
echo "=========================================================="
echo " Backend URL:     http://localhost:8080/api/vehicles"
echo " Swagger UI:      http://localhost:8080/swagger-ui.html"
echo " Frontend URL:    http://localhost:3000"
echo " MySQL Database:  localhost:3306 (vehicle_db)"
echo " Press Ctrl+C at any time to stop both servers."
echo "=========================================================="

# Cleanup function on Ctrl+C
cleanup() {
    echo ""
    echo "Shutting down servers..."
    if [ -n "$BACKEND_PID" ]; then
        kill "$BACKEND_PID" 2>/dev/null || true
    fi
    if [ -n "$FRONTEND_PID" ]; then
        kill "$FRONTEND_PID" 2>/dev/null || true
    fi
    echo "All services stopped."
    exit 0
}

trap cleanup INT TERM

# 1. Start Spring Boot backend
echo "Starting Spring Boot backend..."
cd "$DIR/backend"
java -jar target/vehicle-svc-0.0.1-SNAPSHOT.jar > "$DIR/backend.log" 2>&1 &
BACKEND_PID=$!
echo "Backend started (PID: $BACKEND_PID). Logs: backend.log"

# Wait for backend to be ready
echo -n "Waiting for backend to be ready on port 8080..."
for i in {1..30}; do
    if curl -s http://localhost:8080/api/vehicles/summary > /dev/null 2>&1; then
        echo " Ready!"
        break
    fi
    echo -n "."
    sleep 1
done

# 2. Start React frontend
echo "Starting React frontend on port 3000..."
cd "$DIR/frontend"
npm run dev -- --host 0.0.0.0 --port 3000 &
FRONTEND_PID=$!
echo "Frontend started (PID: $FRONTEND_PID)."

LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "127.0.0.1")

echo ""
echo "=========================================================="
echo " Both servers are running!"
echo " Local URL:          http://localhost:3000"
echo " Backend URL:        http://localhost:8080"
echo " Wi-Fi (LAN) URL:    http://${LOCAL_IP}:3000"
echo ""
echo " 🌐 Want to make this live online on the public internet?"
echo "    Run: ./run-online.sh"
echo "=========================================================="

# Keep script running
wait
