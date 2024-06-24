document.addEventListener("DOMContentLoaded", () => {
    const socket = io();
    const token = localStorage.getItem('token');

    // Elements
    const userList = document.getElementById('user-list');
    const notificationArea = document.getElementById('notification-area');
    const createGroupForm = document.getElementById('create-group-form');
    const groupList = document.getElementById('group-list');
    const statusSelect = document.getElementById('status-select');

    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // Fetch user profiles
    const fetchProfiles = async () => {
        const response = await fetch('/profile', {
            headers: { 'Authorization': token }
        });
        const result = await response.json();
        if (result.success) {
            result.profiles.forEach(profile => {
                const userItem = document.createElement('li');
                userItem.id = `user-${profile.username}`;
                userItem.className = profile.status;
                userItem.innerHTML = `
                    <img src="${profile.avatar}" alt="${profile.username}'s avatar" class="avatar">
                    <span>${profile.username}</span>
                    <span class="status">${profile.status}</span>
                `;
                userItem.addEventListener('click', () => initiatePrivateChat(profile.username));
                userList.appendChild(userItem);
            });
        } else {
            alert(result.message);
        }
    };

    // Initiate private chat
    const initiatePrivateChat = (username) => {
        if (document.getElementById(`chat-${username}`)) return;

        const chatBox = document.createElement('div');
        chatBox.className = 'chat-box';
        chatBox.id = `chat-${username}`;
        chatBox.innerHTML = `
            <div class="chat-header">${username}</div>
            <div class="chat-messages" id="messages-${username}"></div>
            <input type="text" class="chat-input" id="input-${username}" placeholder="Type a message..." />
            <button class="send-btn" onclick="sendPrivateMessage('${username}')">Send</button>
        `;
        document.body.appendChild(chatBox);
    };

    // Send private message
    const sendPrivateMessage = (username) => {
        const messageInput = document.getElementById(`input-${username}`);
        const message = messageInput.value;
        socket.emit('directMessage', { to: username, message });
        messageInput.value = '';
        const messages = document.getElementById(`messages-${username}`);
        messages.innerHTML += `<div><b>You:</b> ${message}</div>`;
    };

    // Handle direct messages
    socket.on('directMessage', ({ from, message }) => {
        const chatBox = document.getElementById(`chat-${from}`);
        if (!chatBox) {
            initiatePrivateChat(from);
        }
        const messages = document.getElementById(`messages-${from}`);
        messages.innerHTML += `<div><b>${from}:</b> ${message}</div>`;
    });

    // Handle user status updates
    socket.on('userStatus', ({ username, status }) => {
        const userItem = document.getElementById(`user-${username}`);
        if (userItem) {
            userItem.querySelector('span.status').textContent = status;
        } else {
            const newUserItem = document.createElement('li');
            newUserItem.id = `user-${username}`;
            newUserItem.className = status;
            newUserItem.innerHTML = `
                <img src="path/to/default-avatar.png" alt="${username}'s avatar" class="avatar">
                <span>${username}</span>
                <span class="status">${status}</span>
            `;
            newUserItem.addEventListener('click', () => initiatePrivateChat(username));
            userList.appendChild(newUserItem);
        }
    });

    // Update status
    if (statusSelect) {
        statusSelect.addEventListener('change', (event) => {
            const status = event.target.value;
            socket.emit('updateStatus', status);
        });
    }

    // Handle notifications
    socket.on('notification', (notification) => {
        const notificationItem = document.createElement('div');
        notificationItem.className = 'notification';
        switch (notification.type) {
            case 'message':
                notificationItem.textContent = `${notification.username} sent a message: ${notification.message}`;
                break;
            case 'directMessage':
                notificationItem.textContent = `You received a direct message from ${notification.from}: ${notification.message}`;
                break;
            case 'groupInvite':
                notificationItem.textContent = `You have been invited to join the group: ${notification.groupName}`;
                break;
            case 'groupMessage':
                notificationItem.textContent = `${notification.username} sent a message in group ${notification.groupName}: ${notification.message}`;
                break;
            default:
                notificationItem.textContent = 'You have a new notification';
        }
        notificationArea.appendChild(notificationItem);
        setTimeout(() => notificationItem.remove(), 5000);
    });

    // Create group chat
    createGroupForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const groupName = createGroupForm.groupName.value;
        socket.emit('createGroup', { groupName }, (response) => {
            if (response.success) {
                addGroupToList(response.groupName);
            } else {
                alert(response.message);
            }
        });
    });

    // Add group to list
    const addGroupToList = (groupName) => {
        const groupItem = document.createElement('li');
        groupItem.id = `group-${groupName}`;
        groupItem.textContent = groupName;
        groupItem.addEventListener('click', () => joinGroup(groupName));
        groupList.appendChild(groupItem);
    };

    // Join group
    const joinGroup = (groupName) => {
        socket.emit('joinGroup', { groupName }, (response) => {
            if (response.success) {
                openGroupChat(groupName);
            } else {
                alert(response.message);
            }
        });
    };

    // Open group chat
    const openGroupChat = (groupName) => {
        if (document.getElementById(`chat-${groupName}`)) return;

        const chatBox = document.createElement('div');
        chatBox.className = 'chat-box';
        chatBox.id = `chat-${groupName}`;
        chatBox.innerHTML = `
            <div class="chat-header">${groupName}</div>
            <div class="chat-messages" id="messages-${groupName}"></div>
            <input type="text" class="chat-input" id="input-${groupName}" placeholder="Type a message..." />
            <button class="send-btn" onclick="sendGroupMessage('${groupName}')">Send</button>
        `;
        document.body.appendChild(chatBox);
    };

    // Send group message
    const sendGroupMessage = (groupName) => {
        const messageInput = document.getElementById(`input-${groupName}`);
        const message = messageInput.value;
        socket.emit('groupMessage', { groupName, message });
        messageInput.value = '';
        const messages = document.getElementById(`messages-${groupName}`);
        messages.innerHTML += `<div><b>You:</b> ${message}</div>`;
    };

    // Handle group messages
    socket.on('groupMessage', ({ groupName, message }) => {
        const messages = document.getElementById(`messages-${groupName}`);
        if (messages) {
            messages.innerHTML += `<div>${message}</div>`;
        }
    });

    // Fetch user profiles on load
    fetchProfiles();
});
