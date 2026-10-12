#!/usr/bin/env bash
# Script to launch the React frontend application
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export PATH="/usr/local/bin:$PATH"

echo "=========================================="
echo "Starting React Frontend Development Server..."
echo "Frontend Port: 3000 (http://localhost:3000)"
echo "API Proxy:     http://localhost:8080"
echo "=========================================="

cd "$DIR/frontend"
npm run dev
