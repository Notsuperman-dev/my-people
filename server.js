const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const userService = require('./services/user-service');
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
    const { username, password } = req.body;
    userService.getUser(username, (err, user) => {
        if (err || !user || user.password !== password) {
            res.redirect('/login');
        } else {
            req.session.user = user;
            res.redirect('/main-menu');
        }
    });
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    userService.createUser(username, password, (err, user) => {
        if (err) {
            res.redirect('/signup');
        } else {
            req.session.user = user;
            res.redirect('/main-menu');
        }
    });
});

app.use(authMiddleware);

app.get('/main-menu', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'main-menu.html'));
});

// Add more routes as needed

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
