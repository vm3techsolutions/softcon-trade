const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

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

module.exports = router;
