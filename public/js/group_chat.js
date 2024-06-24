// public/js/group_chat.js

document.addEventListener("DOMContentLoaded", () => {
    const groupForm = document.getElementById('group-form');
    const groupMessages = document.getElementById('group-messages');
    const groupInput = document.getElementById('group-input');
    const groupSend = document.getElementById('group-send');
    const groupName = new URLSearchParams(window.location.search).get('group');

    if (!groupName) {
        alert('No group specified.');
        return;
    }

    groupSend.addEventListener('click', sendGroupMessage);

    socket.on('groupMessage', ({ username, message }) => {
        groupMessages.innerHTML += `<p>${username}: ${message}</p>`;
        groupMessages.scrollTop = groupMessages.scrollHeight;
    });

    socket.on('groupInvite', ({ groupName, members }) => {
        const accept = confirm(`You have been invited to join group ${groupName} by ${members.join(', ')}. Do you accept?`);
        if (accept) {
            socket.emit('joinGroup', { groupName });
            window.location.href = `/group_chat.html?group=${groupName}`;
        }
    });

    function sendGroupMessage() {
        const message = groupInput.value;
        if (message) {
            socket.emit('groupMessage', { groupName, message });
            groupInput.value = '';
        }
    }
});
