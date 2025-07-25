# Start Chat Service and Frontend
Write-Host "🚀 Starting Chat Service and Frontend..." -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan

# Function to check if a port is in use
function Test-Port {
    param([int]$Port)
    $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    return $connection -ne $null
}

# Start CHAT Service
Write-Host "`n📡 Starting CHAT Service..." -ForegroundColor Yellow
if (Test-Port 5001) {
    Write-Host "⚠️  Port 5001 is already in use. CHAT service might already be running." -ForegroundColor Yellow
} else {
    try {
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'backend\CHAT'; node server.js" -WindowStyle Normal
        Write-Host "✅ CHAT Service started successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to start CHAT Service: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Start Frontend
Write-Host "`n🌐 Starting Frontend..." -ForegroundColor Yellow
if (Test-Port 5173) {
    Write-Host "⚠️  Port 5173 is already in use. Frontend might already be running." -ForegroundColor Yellow
} else {
    try {
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'frontend\ai-avatar-frontend'; npm run dev" -WindowStyle Normal
        Write-Host "✅ Frontend started successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to start Frontend: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Services started!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "📱 Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "💬 CHAT: http://localhost:5001" -ForegroundColor White
Write-Host "`n💡 To test Chat:" -ForegroundColor Yellow
Write-Host "1. Go to http://localhost:5173" -ForegroundColor White
Write-Host "2. Click 'Chat' in the navbar" -ForegroundColor White
Write-Host "3. The chat interface should load in an iframe" -ForegroundColor White 