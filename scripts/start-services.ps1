# SupportSafe Services Startup Script
Write-Host "🚀 Starting SupportSafe Services..." -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan

# Function to check if a port is in use
function Test-Port {
    param([int]$Port)
    $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    return $connection -ne $null
}

# Function to start a service
function Start-Service {
    param(
        [string]$ServiceName,
        [string]$Directory,
        [string]$Command,
        [int]$Port
    )
    
    Write-Host "Starting $ServiceName..." -ForegroundColor Yellow
    
    if (Test-Port $Port) {
        Write-Host "⚠️  Port $Port is already in use. $ServiceName might already be running." -ForegroundColor Yellow
    }
    
    try {
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Directory'; $Command" -WindowStyle Normal
        Write-Host "✅ $ServiceName started successfully" -ForegroundColor Green
    } catch {
        Write-Host ("❌ Failed to start " + $ServiceName + ": " + $_.Exception.Message) -ForegroundColor Red
    }
}

# Start services in order
Write-Host "`n📡 Starting Backend Services..." -ForegroundColor Cyan

# 1. Authentication Server (loginreq)
Start-Service -ServiceName "Authentication Server" -Directory "backend\loginreq" -Command "node index.js" -Port 3001

# 2. AI Avatar Backend
Start-Service -ServiceName "AI Avatar Backend" -Directory "backend\ai-avatar-backend" -Command "npm start" -Port 3000

# 3. CHAT Service
Start-Service -ServiceName "CHAT Service" -Directory "backend\CHAT" -Command "node server.js" -Port 5001

# 4. Stego Bot
Start-Service -ServiceName "Stego Bot" -Directory "backend\stego-bot" -Command "node proxy.js" -Port 3002

# 5. Law Bot (Python FastAPI)
if (Test-Path "backend\law") {
    Write-Host "Starting Law Bot (Python FastAPI)..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'backend\law'; python -m uvicorn main:app --reload --port 8000" -WindowStyle Normal
    Write-Host "✅ Law Bot started successfully" -ForegroundColor Green
} else {
    Write-Host "⚠️  Law Bot directory not found" -ForegroundColor Yellow
}

Write-Host "`n🌐 Starting Frontend..." -ForegroundColor Cyan

# 6. Frontend
Start-Service -ServiceName "Frontend (React)" -Directory "frontend\ai-avatar-frontend" -Command "npm run dev" -Port 5173

Write-Host "`n🎉 All services started!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "📱 Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "🔐 Auth Server: http://localhost:3001" -ForegroundColor White
Write-Host "🤖 AI Avatar: http://localhost:3000" -ForegroundColor White
Write-Host "💬 CHAT: http://localhost:5001" -ForegroundColor White
Write-Host "🔐 Stego Bot: http://localhost:3002" -ForegroundColor White
Write-Host "⚖️  Law Bot: http://localhost:8000" -ForegroundColor White
Write-Host "`n💡 Tip: Check each terminal window for any error messages" -ForegroundColor Yellow 