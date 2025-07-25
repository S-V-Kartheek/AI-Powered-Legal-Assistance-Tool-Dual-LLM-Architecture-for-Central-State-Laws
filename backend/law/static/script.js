document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatContainer = document.getElementById('chat-container');
    const sessionHistory = document.getElementById('session-history');
    const quickTopics = document.querySelectorAll('.quick-topic');
    const downloadBtn = document.getElementById('download-transcript');
    let transcript = [];

    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = isUser ? 'user-message' : 'bot-message';
        const messageContent = document.createElement('p');
        messageContent.className = isUser 
            ? 'bg-green-100 p-3 rounded-lg ml-auto max-w-[80%]'
            : 'bg-blue-100 p-3 rounded-lg max-w-[80%]';
        let formattedMessage = message.replace(/\*\*/g, '');
        formattedMessage = formattedMessage.replace(/\n/g, '<br>');
        messageContent.innerHTML = formattedMessage;
        messageDiv.appendChild(messageContent);
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        // Add to transcript
        transcript.push((isUser ? 'You: ' : 'Bot: ') + message.replace(/<br>/g, '\n'));
        updateSessionHistory();
    }

    function updateSessionHistory() {
        if (transcript.length > 0) {
            sessionHistory.style.display = '';
            sessionHistory.innerHTML = transcript.map(line => `<div>${line}</div>`).join('');
        } else {
            sessionHistory.style.display = 'none';
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const message = userInput.value.trim();
        if (!message) return;
        addMessage(message, true);
        userInput.value = '';
        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            addMessage(data.response);
        } catch (error) {
            console.error('Error:', error);
            addMessage('Sorry, I encountered an error. Please try again.');
        }
    }

    chatForm.addEventListener('submit', handleSubmit);

    // Quick topic buttons
    quickTopics.forEach(btn => {
        btn.addEventListener('click', () => {
            userInput.value = btn.textContent;
            userInput.focus();
        });
    });

    // Download transcript
    downloadBtn.addEventListener('click', () => {
        if (transcript.length === 0) return;
        const blob = new Blob([transcript.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'lawbot_session.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}); 