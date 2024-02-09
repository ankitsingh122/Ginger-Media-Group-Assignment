const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'sql6.freesqldatabase.com',
  user: 'sql6682844',
  password: 'lb49FvpxZy',
  database: 'sql6682844',
  port: 3306
});

const JWT_SECRET = 'ankitsecret';

app.post('/api/signup', (req, res) => {
  const { name, email, password, phone, university, city } = req.body;

  pool.query('INSERT INTO users (name, email, password, phone, university, city) VALUES (?, ?, ?, ?, ?, ?)',
    [name, email, password, phone, university, city],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.status(201).json({ message: 'User registered successfully' });
      }
    });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal server error' });
    } else if (results.length === 0) {
      res.status(401).json({ error: 'Invalid email or password' });
    } else {
      const user = results[0];
      const token = jwt.sign({ userEmail: email, userId: user.id }, JWT_SECRET);
      res.status(200).json({ token });
    }
  });
});

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log('Authorization Header:', authHeader); // Log the Authorization header
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: 'Token not provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Failed to authenticate token:', err); // Log the error for debugging
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }

    req.userId = decoded.userId;
    next();
  });
}

// Get User Details API
app.get('/api/user', verifyToken, (req, res) => {
  const userId = req.userId;

  pool.query('SELECT * FROM users WHERE id = ?', [userId], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Internal server error' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      const user = results[0];
      res.status(200).json(user);
    }
  });
});

app.put('/api/user', verifyToken, (req, res) => {
  const userId = req.userId;
  const { name, phone, city, university } = req.body;

  pool.query('UPDATE users SET name = ?, phone = ?, city = ?, university = ? WHERE id = ?',
    [name, phone, city, university, userId],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.status(200).json({ message: 'User details updated successfully' });
      }
    });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
