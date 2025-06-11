const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/auth');

// GET user info (secured)
router.get('/user/:id', verifyToken, (req, res) => {
  const requestedId = parseInt(req.params.id);
  const loggedInUserId = req.user.id;

  if (requestedId !== loggedInUserId) {
    return res.status(403).json({ error: 'Forbidden: You can only access your own profile' });
  }

  db.query(
    'SELECT id, name, username, email, mobile, address FROM users WHERE id = ?',
    [requestedId],
    (err, results) => {
      if (err) {
        console.error('DB error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(results[0]);
    }
  );
});

module.exports = router;
