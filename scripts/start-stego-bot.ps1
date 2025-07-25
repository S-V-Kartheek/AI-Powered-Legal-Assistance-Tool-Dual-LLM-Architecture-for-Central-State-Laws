# Stego Bot Startup Script
Write-Host "Starting Stego Bot..." -ForegroundColor Green

# Navigate to stego-bot directory
Set-Location "backend\stego-bot"

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Start the stego-bot server
Write-Host "Starting Stego Bot server on http://localhost:3002" -ForegroundColor Cyan
node proxy.js 