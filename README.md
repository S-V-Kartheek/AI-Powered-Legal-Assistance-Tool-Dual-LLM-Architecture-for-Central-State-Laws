# AI-Powered Legal Assistance Tool

A comprehensive AI-powered platform featuring multiple specialized bots and services for legal assistance, therapy, multilingual support, and real-time communication.

## 🌟 Features

### 🤖 AI Bots & Services
- **Law Bot** - AI-powered legal assistance with Google Gemini
- **Therapy Bot** - Mental health support using SarvamAI
- **Stego Bot** - Steganography-based secure communication
- **Multilingual Assistant** - Bhashini LLM for Indian languages
- **AI Avatar** - 3D interactive avatar with voice capabilities

### 💬 Real-time Communication
- **Premium Chat Room** - Advanced real-time messaging with features like:
  - Message reactions and editing
  - Typing indicators
  - Online user tracking
  - Message search and statistics
  - Dark/light theme toggle
  - Sound notifications
  - Reply functionality
  - Inline media previews
  - Double-click to like
  - Message ticks (WhatsApp-style)

### 🏛️ Police Portal
- **Citizen Dashboard** - File complaints and track FIRs
- **Police Dashboard** - Manage complaints and FIRs
- **Analytics** - Real-time statistics and reports

### 🔐 Authentication
- Secure login/registration system
- Protected routes
- User session management

## 🏗️ Architecture

```
Haven/
├── frontend/
│   └── ai-avatar-frontend/          # Main React frontend (Port 5174)
├── backend/
│   ├── ai-avatar-backend/           # Avatar backend service
│   ├── ai-avatar/                   # Avatar assets
│   ├── BhashiniLLM/                 # Multilingual AI service (Port 9000)
│   ├── CHAT/                        # Real-time chat room (Port 3000)
│   ├── law/                         # Law Bot (FastAPI, Port 8000)
│   ├── loginreq/                    # Authentication service
│   ├── project/                     # Police Portal (Port 5176)
│   ├── stego-bot/                   # Steganography service
│   └── therapy-api/                 # Therapy Bot (FastAPI, Port 8001)
├── scripts/                         # Startup scripts
└── haven-env/                       # Python virtual environment
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/S-V-Kartheek/AI-Powered-Legal-Assistance-Tool-Dual-LLM-Architecture-for-Central-State-Laws.git
cd AI-Powered-Legal-Assistance-Tool-Dual-LLM-Architecture-for-Central-State-Laws
```

### 2. Install Dependencies

#### Frontend Dependencies
```bash
cd frontend/ai-avatar-frontend
npm install
```

#### Backend Dependencies
```bash
# Node.js services
cd backend/ai-avatar-backend && npm install
cd ../CHAT && npm install
cd ../loginreq && npm install
cd ../project && npm install
cd ../stego-bot && npm install
cd ../BhashiniLLM/project && npm install

# Python services
cd ../../haven-env/Scripts
./activate
cd ../../backend/law
pip install -r requirements.txt
cd ../therapy-api
pip install sarvamai fastapi uvicorn
```

### 3. Environment Setup

#### Frontend Environment Variables
Create `frontend/ai-avatar-frontend/.env`:
```env
VITE_CHAT_API_URL=http://localhost:3000
VITE_BHASHINI_API_URL=http://localhost:9000
VITE_PROJECT_API_URL=http://localhost:5176
VITE_STEGO_API_URL=http://localhost:3001
VITE_LAW_API_URL=http://localhost:8000
VITE_LOGIN_API_URL=http://localhost:3002
VITE_THERAPY_API_URL=http://localhost:8001
```

#### Backend Environment Variables
Set these environment variables:
```bash
# For Law Bot (Google Gemini)
GOOGLE_API_KEY=your_google_api_key

# For Therapy Bot (SarvamAI)
SARVAM_API_KEY=your_sarvam_api_key

# For Bhashini LLM
BHASHINI_API_KEY=your_bhashini_api_key
```

### 4. Start All Services

#### Option 1: Start All at Once
```bash
npm run start:all
```

#### Option 2: Start Individually

**Frontend:**
```bash
cd frontend/ai-avatar-frontend
npm run dev
```

**Backend Services:**
```bash
# Chat Room
cd backend/CHAT
npm start

# Law Bot
cd backend/law
uvicorn main:app --reload --port 8000

# Therapy Bot
cd backend/therapy-api
uvicorn therapy_api:app --host 0.0.0.0 --port 8001

# Police Portal
cd backend/project
npm run dev

# Multilingual Assistant
cd backend/BhashiniLLM/project
npm run dev

# Stego Bot
cd backend/stego-bot
node proxy.js

# Authentication
cd backend/loginreq
node index.js

# AI Avatar Backend
cd backend/ai-avatar-backend
npm start
```

## 🌐 Access Points

| Service | Local URL | Deployed URL |
|---------|-----------|--------------|
| Main Frontend | http://localhost:5174 | - |
| Chat Room | http://localhost:3000 | https://chatroom-nkdd.onrender.com |
| Law Bot | http://localhost:8000 | https://law-backend-sfjs.onrender.com |
| Police Portal | http://localhost:5176 | https://project-backend-p73p.onrender.com |
| Stego Bot | http://localhost:3001 | https://ai-powered-legal-assistance-tool-dual-70lt.onrender.com |
| Multilingual Assistant | http://localhost:9000 | https://bhashinillm-backend.onrender.com |
| Therapy Bot | http://localhost:8001 | - |

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **React Three Fiber** - 3D graphics
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.io** - Real-time communication
- **FastAPI** - Python web framework
- **Uvicorn** - ASGI server
- **Multer** - File upload handling

### AI & ML
- **Google Gemini** - Law assistance
- **SarvamAI** - Therapy conversations
- **Bhashini LLM** - Multilingual support
- **Speech Recognition** - Voice input

### Database & Storage
- **JSON files** - Local data storage
- **File system** - Asset storage

## 🎨 Features in Detail

### Chat Room Features
- **Real-time messaging** with Socket.io
- **Message reactions and ticks** 
- **Online user tracking**
- **Chat statistics**
- **Inline media previews**
- **Welcome animations**


### Law Bot Features
- **AI-powered legal assistance**
- **Session history management**
- **Download conversation transcripts**
- **Real-time chat interface**

### Therapy Bot Features
- **Mental health support**
- **SarvamAI integration**
- **Conversational therapy sessions**

### Police Portal Features
- **Citizen complaint filing**
- **FIR tracking system**
- **Police dashboard**
- **Analytics and reporting**
- **User authentication**

### Multilingual Assistant Features
- **Support for Indian languages**
- **Text-to-speech**
- **Speech-to-text**
- **Bhashini LLM integration**

## 🚀 Deployment

### Render Deployment

#### Chat Room Deployment
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables if needed

#### Law Bot Deployment
1. Create a new Web Service on Render
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add `GOOGLE_API_KEY` environment variable

#### Therapy Bot Deployment
1. Create a new Web Service on Render
2. Set build command: `pip install sarvamai fastapi uvicorn`
3. Set start command: `uvicorn therapy_api:app --host 0.0.0.0 --port $PORT`
4. Add `SARVAM_API_KEY` environment variable

### Environment Variables for Production
Update your frontend `.env` file with deployed URLs:
```env
VITE_CHAT_API_URL=https://chatroom-nkdd.onrender.com
VITE_BHASHINI_API_URL=https://bhashinillm-backend.onrender.com
VITE_PROJECT_API_URL=https://project-backend-p73p.onrender.com
VITE_STEGO_API_URL=https://ai-powered-legal-assistance-tool-dual-70lt.onrender.com
VITE_LAW_API_URL=https://law-backend-sfjs.onrender.com
VITE_LOGIN_API_URL=https://your-login-backend.onrender.com
VITE_THERAPY_API_URL=https://your-therapy-backend.onrender.com
```

## 📁 Project Structure

```
Haven/
├── frontend/
│   └── ai-avatar-frontend/
│       ├── src/
│       │   ├── components/          # React components
│       │   ├── pages/               # Page components
│       │   ├── hooks/               # Custom hooks
│       │   ├── context/             # React context
│       │   └── assets/              # Static assets
│       ├── public/
│       │   ├── animations/          # 3D animations
│       │   ├── models/              # 3D models
│       │   └── images/              # Images
│       └── package.json
├── backend/
│   ├── ai-avatar-backend/           # Avatar service
│   ├── BhashiniLLM/                 # Multilingual service
│   ├── CHAT/                        # Chat room service
│   ├── law/                         # Law bot service
│   ├── loginreq/                    # Auth service
│   ├── project/                     # Police portal
│   ├── stego-bot/                   # Steganography service
│   └── therapy-api/                 # Therapy bot service
├── scripts/                         # Startup scripts
├── haven-env/                       # Python environment
└── package.json                     # Root package.json
```

## 🔧 Development

### Adding New Features
1. Create feature branch: `git checkout -b feature/new-feature`
2. Implement changes
3. Test thoroughly
4. Commit changes: `git commit -m "Add new feature"`
5. Push to repository: `git push origin feature/new-feature`
6. Create pull request

### Code Style
- Use TypeScript for type safety
- Follow ESLint rules
- Use Tailwind CSS for styling
- Implement responsive design
- Add proper error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

-> S-V-Kartheek
-> gavaskar07
-> Additional contributors welcome!

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation




### Planned Features
- [ ] Voice commands for all bots
- [ ] Advanced analytics dashboard
- [ ] Multi-language support for all services
- [ ] Mobile app development
- [ ] Advanced AI model integration
- [ ] Blockchain integration for secure data
- [ ] Video calling features
- [ ] Advanced 3D avatar interactions

---
