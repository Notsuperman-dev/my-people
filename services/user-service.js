const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

// Create users table if it doesn't exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )`);
});

module.exports = {
    createUser: (username, password, callback) => {
        const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.run(query, [username, password], function(err) {
            callback(err, { id: this.lastID, username, password });
        });
    },
    getUser: (username, callback) => {
        const query = 'SELECT * FROM users WHERE username = ?';
        db.get(query, [username], (err, row) => {
            callback(err, row);
        });
    }
};
