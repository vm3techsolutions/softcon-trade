const db = require('../../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Admin Signup
const adminSignUp = async (req, res) => {
  const { name, username, email, password } = req.body;
  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const checkSql = 'SELECT * FROM admins WHERE username = ? OR email = ?';
    db.query(checkSql, [username, email], async (checkErr, results) => {
      if (checkErr) return res.status(500).json({ message: 'Database error' });
      if (results.length > 0) return res.status(409).json({ message: 'Admin already exists' });

      const hashedPassword = await bcrypt.hash(password, 10);
      const insertSql = `INSERT INTO admins (name, username, email, password)
                         VALUES (?, ?, ?, ?)`;
      db.query(insertSql, [name, username, email, hashedPassword], (err) => {
        if (err) return res.status(500).json({ message: 'Insert failed', error: err });
        return res.status(200).json({ message: 'Admin signup successful' });
      });
    });
  } catch (err) {
    res.status(500).json({ message: 'Unexpected error', error: err });
  }
};

// Admin Login
const adminLogin = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  const sql = "SELECT * FROM admins WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(401).json({ message: 'Invalid email or password' });

    const admin = results[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: admin.id, name: admin.name, email: admin.email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        username: admin.username,
        email: admin.email
      }
    });
  });
};

// Get Admin Data by ID
const getAdminData = (req, res) => {
  const requestedId = parseInt(req.params.id);
  const loggedInAdminId = req.user.id;

  if (requestedId !== loggedInAdminId) {
    return res.status(403).json({ message: 'Unauthorized access' });
  }

  const sql = 'SELECT id, name, username, email FROM admins WHERE id = ?';
  db.query(sql, [requestedId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ message: 'Admin not found' });
    res.status(200).json({ admin: results[0] });
  });
};

module.exports = { adminSignUp, adminLogin, getAdminData };