require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = process.env.PORT;

// MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL');
});

// Basic route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Fetch data from MySQL
app.get('/users', (req, res) => {
    const query = 'SELECT * FROM users'; // Assume you have a users table
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
