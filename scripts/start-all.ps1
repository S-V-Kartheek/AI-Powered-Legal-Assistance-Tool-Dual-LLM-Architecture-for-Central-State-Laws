# scripts/start-all.ps1

# Start ai-avatar-backend
Start-Process powershell -ArgumentList "-NoExit", "cd backend\ai-avatar-backend; npm start"

# Start CHAT
Start-Process powershell -ArgumentList "-NoExit", "cd backend\CHAT; $env:PORT=5003; node server.js"

# Start stego-bot
Start-Process powershell -ArgumentList "-NoExit", "cd backend\stego-bot; node proxy.js"

# Start loginreq (authentication server)
Start-Process powershell -ArgumentList "-NoExit", "cd backend\loginreq; node index.js"

# Start law (if present)
if (Test-Path backend\law) {
    Start-Process powershell -ArgumentList "-NoExit", "cd backend\law; ..\..\haven-env\Scripts\activate; uvicorn main:app --reload"
}

# Start BhashiniLLM backend (multilingual LLM/TTS proxy)
Start-Process powershell -ArgumentList "-NoExit", "cd backend\BhashiniLLM; node project/llm-proxy.mjs"

# Start BhashiniLLM frontend (multilingual app)
Start-Process powershell -ArgumentList "-NoExit", "cd backend\BhashiniLLM\project; npm run dev"

# Start ai-avatar-frontend
Start-Process powershell -ArgumentList "-NoExit", "cd frontend\ai-avatar-frontend; npm run dev" 

# Start Project Management App (will use any available port)
Start-Process powershell -ArgumentList "-NoExit", "cd backend\Project; npm run dev" 