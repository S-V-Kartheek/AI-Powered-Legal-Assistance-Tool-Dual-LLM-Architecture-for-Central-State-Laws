const express = require('express');
const app = express();
const http = require('http').createServer(app);
const cors = require('cors');

// Add CORS middleware for iframe access
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('X-Frame-Options', 'SAMEORIGIN'); // Allow iframe embedding
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
app.use(cors({
  origin: '*', // For demo. In production, use: ["https://your-vercel-app.vercel.app"]
  credentials: true
}));
const io = require('socket.io')(http, {
    cors: {
        origin: "*",  // Allow all origins
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ['websocket', 'polling']
});
const path = require('path');
const multer = require('multer');

// Sample user database (in a real app, this would be in a database)
const users = {
    'user1': { username: 'Mama', avatar: '👨‍💻' },
    'user2': { username: 'Dhoma', avatar: '👩‍💻' },
    'user3': { username: 'Puma', avatar: '👨‍🎨' },
    'user4': { username: 'Comma', avatar: '👩‍🎨' },
    'user5': { username: 'Alex', avatar: '👨‍🔬' }
};

// Vulgar words list
const VULGAR_WORDS = [
  'fuck',
  'bitch',
  'shit',
  'asshole',
  'bastard',
  'dick',
  'pussy',
  'cunt',
  'slut',
  'fag',
  'motherfucker',
  'whore',
  'douche',
  'bollocks',
  'bugger',
  'bloody',
  'bollock',
  'arse',
  'wanker',
  'prick',
  'twat',
  'cock',
  'crap',
  'damn',
  'shithead',
  'douchebag',
  'jackass',
  'jerk',
  'piss',
  'shitface',
  'son of a bitch',
  'tit',
  'tosser',
  'twit',
];

// Track user violations by socket ID
const userViolations = {};

// Track online users and typing status
const onlineUsers = new Map();
const typingUsers = new Set();

function censorMessage(message) {
  let found = false;
  let censored = message;
  VULGAR_WORDS.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    if (regex.test(censored)) {
      found = true;
      censored = censored.replace(regex, '*'.repeat(word.length));
    }
  });
  return { censored, found };
}

// Serve static files from the public directory
app.use(express.static('public'));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
const upload = multer({ storage: storage });

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle file uploads
app.post('/upload', upload.single('image'), (req, res) => {
    if (req.file) {
        res.json({ 
            success: true, 
            file: {
                path: '/uploads/' + req.file.filename,
                type: req.file.mimetype
            }
        });
    } else {
        res.json({ success: false });
    }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected. Socket ID:', socket.id);
    
    // Assign a random user to the new connection
    const userId = Object.keys(users)[Math.floor(Math.random() * Object.keys(users).length)];
    const user = users[userId];
    
    // Add to online users
    onlineUsers.set(socket.id, { userId, ...user });
    
    // Send user info to the client
    socket.emit('user assigned', { userId, ...user });
    
    // Broadcast new user to all clients
    io.emit('user joined', { userId, ...user });
    
    // Broadcast updated online users list
    io.emit('online users update', Array.from(onlineUsers.values()));

    // Handle new messages
    socket.on('chat message', (msg) => {
        // Censor vulgar words
        const { censored, found } = censorMessage(msg.content);
        if (found) {
            userViolations[socket.id] = (userViolations[socket.id] || 0) + 1;
            msg.content = censored;
            // Notify the user about the warning
            socket.emit('warning', {
                message: `Vulgar language is not allowed! (${userViolations[socket.id]}/3 chances used)`
            });
            if (userViolations[socket.id] >= 3) {
                socket.emit('kicked', { message: 'You have been kicked for repeated use of vulgar language.' });
                socket.disconnect();
                return;
            }
        }
        // Broadcast to all clients including sender
        io.emit('chat message', {
            ...msg,
            userId,
            username: user.username,
            avatar: user.avatar,
            socketId: socket.id,
            timestamp: new Date().toISOString()
        });
        console.log('Message broadcasted to all clients');
    });

    // Handle typing events
    socket.on('typing', (data) => {
        const user = onlineUsers.get(socket.id);
        if (user) {
            io.emit('user typing', { 
                userId: user.userId, 
                username: user.username, 
                isTyping: data.isTyping 
            });
        }
    });

    // Handle reactions
    socket.on('reaction', (data) => {
        io.emit('reaction update', data);
    });

    // Handle message editing
    socket.on('edit message', (data) => {
        io.emit('message edited', data);
    });

    // Handle message deletion
    socket.on('delete message', (data) => {
        io.emit('message deleted', data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected. Socket ID:', socket.id);
        
        // Remove from online users
        onlineUsers.delete(socket.id);
        
        io.emit('user left', { userId, ...user });
        io.emit('online users update', Array.from(onlineUsers.values()));
    });

    // Handle connection errors
    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('public/uploads')) {
    fs.mkdirSync('public/uploads', { recursive: true });
}

// Start the server
const PORT = process.env.PORT || 5003;
const HOST = '0.0.0.0';  // Listen on all network interfaces
http.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
    console.log('To access from other devices on the same network, use your computer\'s IP address');
}); 
