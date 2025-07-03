const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../../config/db");
const sendEmail = require("../../config/forgotMail");

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
    // console.log("Login attempt with password:", password);
  

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

// Forgot Password
const forgotPassword = async (req, res) => {
  console.log("Forgot Password endpoint hit");
  const { email } = req.body;

  try {
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, users) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (!users || users.length === 0) return res.status(400).json({ error: "User not found" });

      const user = users[0];
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "15m" });
      const resetLink = `${process.env.FRONT_END_URL}/reset-password?token=${token}`;

      await sendEmail(email, "Password Reset", `Reset your password here: <a href="${resetLink}">${resetLink}</a>`);

      res.json({ success: true, message: "Password reset link sent to email" });
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  console.log("Reset Password endpoint hit");
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    db.query("SELECT * FROM users WHERE id = ?", [decoded.id], async (err, users) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (!users || users.length === 0) return res.status(400).json({ error: "User not found" });

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      db.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, decoded.id], (err) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ success: true, message: "Password reset successful" });
      });
    });
  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(400).json({ error: "Invalid or expired token" });
  }
};

module.exports = {
  userSignUp,
  userLogin,
  forgotPassword,
  resetPassword,
};
