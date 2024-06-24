const socket = io();

function showWorldChat() {
    window.location.href = '/chat.html';
}

function logout() {
    window.location.href = '/index.html';
}

function sendMessage() {
    const message = document.getElementById('chat-input').value;
    if (message) {
        socket.emit('message', message);
        document.getElementById('chat-input').value = '';
    }
}

socket.on('message', (message) => {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML += `<p>${message}</p>`;
    chatMessages.scrollTop = chatMessages.scrollHeight;
});
