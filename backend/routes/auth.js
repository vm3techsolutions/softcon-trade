require('dotenv').config();
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Signup Route
router.post('/signup', async (req, res) => {
  const { name, username, email, password, mobile, address } = req.body;

  // Basic field validation
  if (!name || !username || !email || !password || !mobile || !address) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if username or email already exists
    const checkSql = 'SELECT * FROM users WHERE username = ? OR email = ?';
    db.query(checkSql, [username, email], async (checkErr, checkResults) => {
      if (checkErr) {
        console.error('Error checking user existence:', checkErr);
        return res.status(500).json({ message: 'Database error' });
      }

      if (checkResults.length > 0) {
        return res.status(409).json({ message: 'Username or email already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      const insertSql = `
        INSERT INTO users (name, username, email, password, mobile, address)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.query(
  insertSql,
  [name, username, email, hashedPassword, mobile, address],
  (err, result) => {
    if (err) {
      console.error('Error inserting user:', err.sqlMessage || err.message);
      return res.status(500).json({ message: 'Insert failed', error: err });
    }

    console.log('User inserted:', result);
    res.status(200).json({ message: 'Signup successful' });
  }
);
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ message: 'Unexpected server error' });
  }
});


// POST /login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("Database error during login:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = results[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    try {
      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          mobile: user.mobile,
          address: user.address,
        },
      });
    } catch (jwtError) {
      console.error("JWT error:", jwtError);
      return res.status(500).json({ message: "Token generation failed" });
    }
  });
});


module.exports = router;
