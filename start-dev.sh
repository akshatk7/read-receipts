#!/bin/bash

echo "🚀 Starting Read Receipts Development Environment..."

# Build shared types first
echo "📦 Building shared types..."
cd shared && npm run build && cd ..

# Start backend in background
echo "🔧 Starting backend server..."
cd backend && npm run dev &
BACKEND_PID=$!

# Start frontend in background  
echo "🎨 Starting frontend server..."
cd frontend && npm run dev &
FRONTEND_PID=$!

# Wait a moment for servers to start
sleep 3

echo ""
echo "✅ Development servers started!"
echo "📊 Backend: http://localhost:3001"
echo "🎨 Frontend: http://localhost:8080"
echo "📊 Health check: http://localhost:3001/health"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for user to stop
wait 