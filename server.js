const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'landing.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.post('/login', (req, res) => {
    // Handle login logic
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

app.post('/signup', (req, res) => {
    // Handle signup logic
});

app.use(authMiddleware);

app.get('/main-menu', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'main-menu.html'));
});

// Add more routes as needed

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
