#!/usr/bin/env bash
# Script to launch the Spring Boot backend service
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export JAVA_HOME="/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home"
export PATH="$JAVA_HOME/bin:$PATH"

echo "=========================================="
echo "Starting Spring Boot Vehicle Service..."
echo "Java version: $(java -version 2>&1 | head -n 1)"
echo "Backend Port: 8080"
echo "Swagger UI:   http://localhost:8080/swagger-ui.html"
echo "API Base:     http://localhost:8080/api/vehicles"
echo "=========================================="

cd "$DIR/backend"
./mvnw spring-boot:run
