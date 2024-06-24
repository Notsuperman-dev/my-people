function joinRoom() {
    const roomName = document.getElementById('join-room-name').value;
    const roomPassword = document.getElementById('join-room-password').value;
    if (roomName) {
        // Join the room (check password if necessary)
        window.location.href = `/chat.html?room=${roomName}`;
    }
}
