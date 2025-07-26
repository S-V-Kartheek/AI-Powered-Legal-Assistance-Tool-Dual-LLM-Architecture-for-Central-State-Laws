// Initialize Socket.IO with explicit configuration
const socket = io({
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
});

const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messagesDiv = document.getElementById('messages');
const imageUpload = document.getElementById('image-upload');

let currentUser = null;

// Share link functionality
const shareLinkInput = document.getElementById('share-link');
const copyLinkBtn = document.getElementById('copy-link-btn');
const themeToggle = document.getElementById('theme-toggle');
const typingIndicator = document.getElementById('typing-indicator');
const onlineUsersList = document.getElementById('online-users-list');
const onlineCount = document.querySelector('.online-count');

// Set the share link to current URL
shareLinkInput.value = window.location.href;

// Theme toggle functionality
let isDarkMode = false;
themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
    themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
});

// Online users tracking
let onlineUsers = new Set();
let typingUsers = new Set();

// Chat statistics
let chatStats = {
    totalMessages: 0,
    totalWords: 0,
    totalImages: 0,
    totalUsers: 0
};

// Sound settings
let soundEnabled = true;

// Message history for search
let messageHistory = [];

// Modal elements
const searchModal = document.getElementById('search-modal');
const statsModal = document.getElementById('stats-modal');
const searchBtn = document.getElementById('search-btn');
const statsBtn = document.getElementById('stats-btn');
const soundToggle = document.getElementById('sound-toggle');
const closeSearch = document.getElementById('close-search');
const closeStats = document.getElementById('close-stats');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

// Copy link functionality
copyLinkBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(shareLinkInput.value);
        copyLinkBtn.textContent = '✅ Copied!';
        copyLinkBtn.classList.add('copied');
        
        // Reset button after 2 seconds
        setTimeout(() => {
            copyLinkBtn.textContent = '📋 Copy';
            copyLinkBtn.classList.remove('copied');
        }, 2000);
    } catch (err) {
        // Fallback for older browsers
        shareLinkInput.select();
        shareLinkInput.setSelectionRange(0, 99999);
        document.execCommand('copy');
        
        copyLinkBtn.textContent = '✅ Copied!';
        copyLinkBtn.classList.add('copied');
        
        setTimeout(() => {
            copyLinkBtn.textContent = '📋 Copy';
            copyLinkBtn.classList.remove('copied');
        }, 2000);
    }
});

// Also allow clicking on the input to select all text
shareLinkInput.addEventListener('click', () => {
    shareLinkInput.select();
});

// Modal functionality
searchBtn.addEventListener('click', () => {
    searchModal.style.display = 'flex';
    searchInput.focus();
});

statsBtn.addEventListener('click', () => {
    updateStats();
    statsModal.style.display = 'flex';
});

soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundToggle.textContent = soundEnabled ? '🔊' : '🔇';
    soundToggle.title = soundEnabled ? 'Sounds enabled' : 'Sounds disabled';
});

closeSearch.addEventListener('click', () => {
    searchModal.style.display = 'none';
    searchInput.value = '';
    searchResults.innerHTML = '';
});

closeStats.addEventListener('click', () => {
    statsModal.style.display = 'none';
});

// Close modals when clicking outside
searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) {
        searchModal.style.display = 'none';
    }
});

statsModal.addEventListener('click', (e) => {
    if (e.target === statsModal) {
        statsModal.style.display = 'none';
    }
});

// Search functionality
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    if (query.length < 2) {
        searchResults.innerHTML = '';
        return;
    }
    
    const results = messageHistory.filter(msg => 
        msg.content.toLowerCase().includes(query) ||
        msg.username.toLowerCase().includes(query)
    );
    
    displaySearchResults(results);
});

function displaySearchResults(results) {
    searchResults.innerHTML = '';
    
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-result-item">No messages found</div>';
        return;
    }
    
    results.slice(0, 10).forEach(msg => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        resultItem.innerHTML = `
            <div class="result-username">${msg.username}</div>
            <div class="result-message">${msg.content.substring(0, 100)}${msg.content.length > 100 ? '...' : ''}</div>
        `;
        resultItem.addEventListener('click', () => {
            // Scroll to message
            const messages = document.querySelectorAll('.message');
            const targetMessage = Array.from(messages).find(m => 
                m.querySelector('.message-content').textContent.includes(msg.content.substring(0, 20))
            );
            if (targetMessage) {
                targetMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                targetMessage.style.animation = 'pulse 1s ease';
                setTimeout(() => {
                    targetMessage.style.animation = '';
                }, 1000);
            }
            searchModal.style.display = 'none';
        });
        searchResults.appendChild(resultItem);
    });
}

// Confetti animation for welcome
function showConfetti() {
    const confetti = document.createElement('canvas');
    confetti.className = 'confetti';
    document.body.appendChild(confetti);
    const ctx = confetti.getContext('2d');
    const W = window.innerWidth, H = window.innerHeight;
    confetti.width = W; confetti.height = H;
    let pieces = [];
    for (let i = 0; i < 120; i++) {
        pieces.push({
            x: Math.random() * W,
            y: Math.random() * H - H,
            r: 6 + Math.random() * 8,
            d: 2 + Math.random() * 2,
            color: `hsl(${Math.random()*360},90%,70%)`,
            tilt: Math.random() * 10 - 5
        });
    }
    let frame = 0;
    function draw() {
        ctx.clearRect(0, 0, W, H);
        for (let p of pieces) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = 0.8;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
        update();
        frame++;
        if (frame < 120) requestAnimationFrame(draw);
        else setTimeout(() => confetti.remove(), 1200);
    }
    function update() {
        for (let p of pieces) {
            p.y += p.d + Math.sin(frame/10 + p.x/100)*2;
            p.x += Math.sin(frame/10 + p.y/100)*2;
            if (p.y > H) p.y = -10;
        }
    }
    draw();
}

// Show confetti when user joins
socket.on('user assigned', (user) => {
    currentUser = user;
    showConfetti();
    console.log('Assigned user:', user);
    addSystemMessage(`You are logged in as ${user.username}`);
    updateOnlineUsers();
});

// Update online users count in stats modal
function updateStats() {
    document.getElementById('total-messages').textContent = chatStats.totalMessages;
    document.getElementById('total-users').textContent = onlineUsers.size;
    document.getElementById('total-words').textContent = chatStats.totalWords;
    document.getElementById('total-images').textContent = chatStats.totalImages;
}

// Sound notification
function playNotificationSound() {
    if (!soundEnabled) return;
    
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
    audio.volume = 0.3;
    audio.play().catch(() => {}); // Ignore errors if audio fails to play
}

// Connection status handling
socket.on('connect', () => {
    console.log('Connected to server with ID:', socket.id);
    addSystemMessage('Connected to chat room');
});

// Update online users display
function updateOnlineUsers() {
    onlineCount.textContent = `${onlineUsers.size} online`;
    onlineUsersList.innerHTML = '';
    
    onlineUsers.forEach(user => {
        const avatar = document.createElement('div');
        avatar.className = 'user-avatar-small';
        avatar.textContent = user.avatar;
        avatar.title = user.username;
        onlineUsersList.appendChild(avatar);
    });
}

// Typing indicator
let typingTimeout;
messageInput.addEventListener('input', () => {
    socket.emit('typing', { isTyping: true });
    
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        socket.emit('typing', { isTyping: false });
    }, 1000);
});

socket.on('user typing', (data) => {
    if (data.userId !== currentUser?.userId) {
        if (data.isTyping) {
            typingUsers.add(data.username);
        } else {
            typingUsers.delete(data.username);
        }
        
        if (typingUsers.size > 0) {
            typingIndicator.style.display = 'flex';
            const typingText = typingIndicator.querySelector('.typing-text');
            const users = Array.from(typingUsers).join(', ');
            typingText.textContent = `${users} ${typingUsers.size === 1 ? 'is' : 'are'} typing...`;
        } else {
            typingIndicator.style.display = 'none';
        }
    }
});

socket.on('user joined', (user) => {
    if (user.userId !== currentUser?.userId) {
        addSystemMessage(`${user.username} joined the chat`);
    }
});

socket.on('user left', (user) => {
    addSystemMessage(`${user.username} left the chat`);
    updateOnlineUsers();
});

socket.on('online users update', (users) => {
    onlineUsers.clear();
    users.forEach(user => onlineUsers.add(user));
    updateOnlineUsers();
});

socket.on('reaction update', (data) => {
    // Find the message and update its reactions
    const messages = document.querySelectorAll('.message');
    messages.forEach(message => {
        const reactions = message.querySelectorAll('.reaction');
        
        reactions.forEach(reaction => {
            if (reaction.textContent.includes(data.emoji)) {
                const count = reaction.querySelector('.reaction-count');
                const currentCount = parseInt(count.textContent) || 0;
                const newCount = currentCount + 1;
                count.textContent = newCount;
                reaction.classList.add('active');
                
                // Show the count when it's greater than 0
                if (newCount > 0) {
                    count.style.display = 'inline';
                }
            }
        });
    });
});

socket.on('message edited', (data) => {
    // Find and update the edited message
    const messages = document.querySelectorAll('.message');
    messages.forEach(message => {
        if (message.dataset.messageId === data.messageId) {
            const messageContent = message.querySelector('.message-content');
            messageContent.innerHTML = data.newContent;
        }
    });
});

socket.on('message deleted', (data) => {
    // Find and remove the deleted message
    const messages = document.querySelectorAll('.message');
    messages.forEach(message => {
        if (message.dataset.messageId === data.messageId) {
            message.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => {
                message.remove();
            }, 300);
        }
    });
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
    addSystemMessage('Disconnected from chat room');
});

socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
    addSystemMessage('Connection error. Please refresh the page.');
});

// --- Reply to Message ---
let replyTo = null;
const replyPreviewContainer = document.getElementById('reply-preview-container');

function showReplyPreview(msg) {
    replyTo = msg;
    replyPreviewContainer.innerHTML = `
        <div class="reply-preview">
            <span class="reply-username">${msg.username}</span>
            <span class="reply-content">${msg.content.length > 60 ? msg.content.substring(0, 60) + '…' : msg.content}</span>
            <button class="close-btn" id="close-reply-preview">×</button>
        </div>
    `;
    document.getElementById('close-reply-preview').onclick = () => {
        replyTo = null;
        replyPreviewContainer.innerHTML = '';
    };
}

// --- Message Ticks ---
function getMessageTicks(status) {
    if (status === 'seen') {
        return `<span class="message-ticks"><span class="message-tick seen">✔✔</span></span>`;
    } else if (status === 'delivered') {
        return `<span class="message-ticks"><span class="message-tick">✔✔</span></span>`;
    } else {
        return `<span class="message-ticks"><span class="message-tick">✔</span></span>`;
    }
}

// --- Double-click Like ---
function handleDoubleClickLike(messageDiv, msg) {
    messageDiv.classList.add('message-liked');
    setTimeout(() => messageDiv.classList.remove('message-liked'), 900);
    socket.emit('reaction', { messageId: msg.socketId, emoji: '❤️' });
}

// --- Message Rendering Update ---
socket.on('chat message', (msg) => {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${msg.socketId === socket.id ? 'sent' : 'received'}`;
    messageDiv.dataset.messageId = msg.socketId;
    
    // User info
    const userInfo = document.createElement('div');
    userInfo.className = 'user-info';
    const avatar = document.createElement('span');
    avatar.className = 'user-avatar';
    avatar.textContent = msg.avatar;
    avatar.title = msg.username;
    userInfo.appendChild(avatar);
    const username = document.createElement('span');
    username.className = 'username';
    username.textContent = msg.username;
    userInfo.appendChild(username);
    messageDiv.appendChild(userInfo);
    
    // Reply preview in message
    if (msg.replyTo) {
        const replyDiv = document.createElement('div');
        replyDiv.className = 'reply-preview';
        replyDiv.innerHTML = `<span class="reply-username">${msg.replyTo.username}</span> <span class="reply-content">${msg.replyTo.content.length > 60 ? msg.replyTo.content.substring(0, 60) + '…' : msg.replyTo.content}</span>`;
        messageDiv.appendChild(replyDiv);
    }
    
    // Message content
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    if (msg.type === 'text') {
        // Inline image/video preview
        if (/\.(jpg|jpeg|png|gif)$/i.test(msg.content)) {
            const img = document.createElement('img');
            img.src = msg.content;
            img.alt = 'Image';
            img.style.maxWidth = '180px';
            img.style.borderRadius = '8px';
            messageContent.appendChild(img);
        } else if (/\.(mp4|webm|ogg)$/i.test(msg.content)) {
            const video = document.createElement('video');
            video.src = msg.content;
            video.controls = true;
            video.style.maxWidth = '180px';
            video.style.borderRadius = '8px';
            messageContent.appendChild(video);
        } else {
            // Convert URLs to clickable links
            const textWithLinks = msg.content.replace(
                /(https?:\/\/[^\s]+)/g,
                '<a href="$1" target="_blank">$1</a>'
            );
            messageContent.innerHTML = textWithLinks;
        }
    } else if (msg.type === 'image') {
        const img = document.createElement('img');
        img.src = msg.content;
        img.alt = 'Uploaded image';
        messageContent.appendChild(img);
    }
    
    // Message ticks (for sent messages)
    if (msg.socketId === socket.id) {
        messageContent.innerHTML += getMessageTicks(msg.status || 'delivered');
    }
    
    // Add reply button
    const replyBtn = document.createElement('button');
    replyBtn.className = 'message-action-btn';
    replyBtn.innerHTML = '↩️';
    replyBtn.title = 'Reply';
    replyBtn.onclick = (e) => {
        e.stopPropagation();
        showReplyPreview(msg);
    };
    messageContent.appendChild(replyBtn);
    
    // Add message actions (edit/delete for own messages)
    if (msg.socketId === socket.id) {
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'message-actions';
        const editBtn = document.createElement('button');
        editBtn.className = 'message-action-btn';
        editBtn.innerHTML = '✏️';
        editBtn.title = 'Edit message';
        editBtn.onclick = () => editMessage(messageDiv, msg);
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'message-action-btn delete';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.title = 'Delete message';
        deleteBtn.onclick = () => deleteMessage(messageDiv, msg);
        actionsContainer.appendChild(editBtn);
        actionsContainer.appendChild(deleteBtn);
        messageContent.appendChild(actionsContainer);
    }
    
    messageDiv.appendChild(messageContent);
    // Add reactions container
    const reactionsContainer = document.createElement('div');
    reactionsContainer.className = 'message-reactions';
    const reactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];
    reactions.forEach(emoji => {
        const reactionBtn = document.createElement('div');
        reactionBtn.className = 'reaction';
        reactionBtn.innerHTML = `${emoji} <span class="reaction-count" style="display: none;">0</span>`;
        reactionBtn.onclick = () => {
            socket.emit('reaction', { messageId: msg.socketId, emoji });
        };
        reactionsContainer.appendChild(reactionBtn);
    });
    messageDiv.appendChild(reactionsContainer);
    messagesDiv.appendChild(messageDiv);
    // Add to message history for search
    messageHistory.push({
        content: msg.content,
        username: msg.username,
        timestamp: msg.timestamp
    });
    // Update stats
    chatStats.totalMessages++;
    if (msg.type === 'text') {
        chatStats.totalWords += msg.content.split(' ').length;
    } else if (msg.type === 'image') {
        chatStats.totalImages++;
    }
    // Play notification sound for received messages
    if (msg.socketId !== socket.id) {
        playNotificationSound();
    }
    // Double-click to like
    messageDiv.ondblclick = () => handleDoubleClickLike(messageDiv, msg);
    // Scroll to bottom with smooth animation
    messagesDiv.scrollTo({
        top: messagesDiv.scrollHeight,
        behavior: 'smooth'
    });
});

// --- Send message with reply ---
messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message) {
        const messageData = {
            type: 'text',
            content: message,
            timestamp: new Date().toISOString(),
            replyTo: replyTo ? { username: replyTo.username, content: replyTo.content } : undefined
        };
        socket.emit('chat message', messageData);
        messageInput.value = '';
        replyTo = null;
        replyPreviewContainer.innerHTML = '';
    }
});

// Handle image upload
imageUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            
            if (data.success) {
                const messageData = {
                    type: 'image',
                    content: data.file.path,
                    timestamp: new Date().toISOString()
                };
                socket.emit('chat message', messageData);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            addSystemMessage('Error uploading image. Please try again.');
        }
    }
});

// Message editing functionality
function editMessage(messageDiv, msg) {
    const messageContent = messageDiv.querySelector('.message-content');
    const originalText = messageContent.textContent;
    
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'message-edit-input';
    editInput.value = originalText;
    
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.className = 'control-btn';
    saveBtn.style.marginTop = '8px';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.className = 'control-btn';
    cancelBtn.style.marginTop = '8px';
    cancelBtn.style.marginLeft = '8px';
    
    messageContent.innerHTML = '';
    messageContent.appendChild(editInput);
    messageContent.appendChild(saveBtn);
    messageContent.appendChild(cancelBtn);
    
    editInput.focus();
    editInput.select();
    
    saveBtn.onclick = () => {
        const newText = editInput.value.trim();
        if (newText && newText !== originalText) {
            socket.emit('edit message', { messageId: msg.socketId, newContent: newText });
            messageContent.innerHTML = newText;
        } else {
            messageContent.innerHTML = originalText;
        }
    };
    
    cancelBtn.onclick = () => {
        messageContent.innerHTML = originalText;
    };
    
    editInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveBtn.click();
        } else if (e.key === 'Escape') {
            cancelBtn.click();
        }
    });
}

// Message deletion functionality
function deleteMessage(messageDiv, msg) {
    if (confirm('Are you sure you want to delete this message?')) {
        socket.emit('delete message', { messageId: msg.socketId });
        messageDiv.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }
}

// Helper function to add system messages
function addSystemMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message system';
    messageDiv.innerHTML = `<div class="message-content">${message}</div>`;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
} 
