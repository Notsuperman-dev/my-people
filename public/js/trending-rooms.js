function updateProfile() {
    const newUsername = document.getElementById('new-username').value;
    const newPassword = document.getElementById('new-password').value;
    if (newUsername || newPassword) {
        // Update the user profile in the database (implementation depends on your backend)
        alert('Profile updated successfully!');
    }
}
// Placeholder for profile page logic
document.addEventListener("DOMContentLoaded", () => {
    const profileForm = document.getElementById('profile-form');
    const username = document.getElementById('username').value;

    profileForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const profile = {
            bio: document.getElementById('bio').value,
            avatar: document.getElementById('avatar').value
        };

        fetch('/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, profile })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Profile updated successfully');
            } else {
                alert('Failed to update profile: ' + data.message);
            }
        });
    });

    fetch(`/profile?username=${username}`)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('bio').value = data.profile.bio;
            document.getElementById('avatar').value = data.profile.avatar;
        }
    });
});
// public/js/profile.js

document.addEventListener("DOMContentLoaded", () => {
    const profileForm = document.getElementById('profile-form');
    profileForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const bio = profileForm.bio.value;
        const avatar = profileForm.avatar.files[0];
        const formData = new FormData();
        formData.append('bio', bio);
        formData.append('avatar', avatar);

        const response = await fetch('/profile', {
            method: 'POST',
            headers: { 'Authorization': localStorage.getItem('token') },
            body: formData
        });

        const result = await response.json();
        if (result.success) {
            alert('Profile updated successfully.');
        } else {
            alert(result.message);
        }
    });

    const fetchProfile = async () => {
        const response = await fetch('/profile', {
            headers: { 'Authorization': localStorage.getItem('token') }
        });
        const result = await response.json();
        if (result.success) {
            profileForm.bio.value = result.profile.bio;
        } else {
            alert(result.message);
        }
    };

    fetchProfile();
});
