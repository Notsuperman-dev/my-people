// public/js/chat.js

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    const socket = io({ query: { token } });

    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const userList = document.getElementById('user-list');
    const typingIndicator = document.getElementById('typing-indicator');
    const recipientSelect = document.getElementById('recipient-select');
    const fileInput = document.getElementById('file-input');
    const fileSend = document.getElementById('file-send');

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('input', () => socket.emit('typing', chatInput.value.length > 0));
    fileSend.addEventListener('click', sendFile);

    socket.on('message', ({ username, message }) => {
        chatMessages.innerHTML += `<p>${username}: ${message}</p>`;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    socket.on('directMessage', ({ from, message }) => {
        alert(`Direct message from ${from}: ${message}`);
    });

    socket.on('fileMessage', ({ username, fileUrl }) => {
        chatMessages.innerHTML += `<p>${username}: <a href="${fileUrl}" target="_blank">File</a></p>`;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    socket.on('updateUsers', (users) => {
        userList.innerHTML = '';
        recipientSelect.innerHTML = '<option value="All">All</option>';
        users.forEach(user => {
            const userOption = document.createElement('option');
            userOption.value = user;
            userOption.textContent = user;
            recipientSelect.appendChild(userOption);

            const userItem = document.createElement('li');
            userItem.id = `user-${user}`;
            userItem.textContent = user;
            userList.appendChild(userItem);
        });
    });

    socket.on('userStatus', ({ username, status }) => {
        const userItem = document.getElementById(`user-${username}`);
        if (userItem) {
            userItem.className = status;
        } else {
            const newUserItem = document.createElement('li');
            newUserItem.id = `user-${username}`;
            newUserItem.className = status;
            newUserItem.textContent = username;
            userList.appendChild(newUserItem);
        }
    });

    socket.on('typing', ({ username, isTyping }) => {
        typingIndicator.textContent = isTyping ? `${username} is typing...` : '';
    });

    socket.on('notification', ({ username, message }) => {
        if (document.hidden && Notification.permission === "granted") {
            new Notification(`${username}`, {
                body: message,
                icon: '/path/to/icon.png'  // Optional: Add a path to an icon image
            });
        }
    });

    function sendMessage() {
        const message = chatInput.value;
        const recipient = recipientSelect.value;
        if (message) {
            if (recipient === 'All') {
                socket.emit('message', { username: socket.username, message });
            } else {
                socket.emit('directMessage', { to: recipient, message });
            }
            chatInput.value = '';
            socket.emit('typing', false);
        }
    }

    function sendFile() {
        const file = fileInput.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            fetch('/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                socket.emit('fileMessage', { username: socket.username, fileUrl: data.file });
            });
        }
    }
});
