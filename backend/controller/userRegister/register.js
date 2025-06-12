const db = require('../../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Signup
const userSignUp = async (req, res) => {
  const { name, username, email, password, mobile, address } = req.body;

  if (!name || !username || !email || !password || !mobile || !address) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const checkSql = 'SELECT * FROM users WHERE username = ? OR email = ?';
    db.query(checkSql, [username, email], async (checkErr, results) => {
      if (checkErr) return res.status(500).json({ message: 'Database error' });
      if (results.length > 0) return res.status(409).json({ message: 'User already exists' });

      const hashedPassword = await bcrypt.hash(password, 10);

      const insertSql = `INSERT INTO users (name, username, email, password, mobile, address)
                         VALUES (?, ?, ?, ?, ?, ?)`;

      db.query(insertSql, [name, username, email, hashedPassword, mobile, address], (err) => {
        if (err) return res.status(500).json({ message: 'Insert failed', error: err });
        return res.status(200).json({ message: 'Signup successful' });
      });
    });
  } catch (err) {
    res.status(500).json({ message: 'Unexpected error', error: err });
  }
};

// Login
const userLogin = (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt with email:", email);
    console.log("Login attempt with password:", password);
  

  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(401).json({ message: 'Invalid email or password' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        address: user.address
      }
    });
  });
};

module.exports = { userSignUp, userLogin };
