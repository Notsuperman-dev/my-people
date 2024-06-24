function createRoom() {
    const roomName = document.getElementById('room-name').value;
    const roomPassword = document.getElementById('room-password').value;
    if (roomName) {
        // Create the room in the database (implementation depends on your backend)
        alert('Room created successfully!');
        window.location.href = `/chat.html?room=${roomName}`;
    }
}
