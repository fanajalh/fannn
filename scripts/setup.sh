#!/bin/bash

# JokiPoster Website Setup Script
# This script helps automate the setup process

echo "🚀 JokiPoster Website Setup Script"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    echo "Please install npm (usually comes with Node.js)"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo ""
    echo "⚙️ Creating environment file..."
    
    if [ -f ".env.local.example" ]; then
        cp .env.local.example .env.local
        echo "✅ Created .env.local from template"
        echo "⚠️  Please edit .env.local and add your Supabase credentials"
    else
        echo "❌ .env.local.example not found"
        echo "Please create .env.local manually"
    fi
else
    echo "✅ .env.local already exists"
fi

# Create necessary directories
echo ""
echo "📁 Creating directories..."
mkdir -p public/images
mkdir -p logs
echo "✅ Directories created"

# Check setup status
echo ""
echo "🔍 Checking setup status..."
echo "Starting development server to test setup..."

# Start development server in background
npm run dev &
DEV_PID=$!

# Wait a moment for server to start
sleep 5

# Test if server is running
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Development server is running"
    
    # Test setup endpoint
    echo "🧪 Testing setup..."
    curl -s http://localhost:3000/api/setup-check | jq '.' 2>/dev/null || echo "Setup check endpoint available"
    
else
    echo "❌ Development server failed to start"
fi

# Kill development server
kill $DEV_PID 2>/dev/null

echo ""
echo "🎉 Setup completed!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your Supabase credentials"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:3000"
echo "4. Test: http://localhost:3000/api/setup-check"
echo ""
echo "📖 For detailed instructions, see SETUP_TUTORIAL.md"
