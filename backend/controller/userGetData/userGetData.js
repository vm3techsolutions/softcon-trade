const db = require('../../config/db');

const userGetData = (req, res) => {
  const requestedId = parseInt(req.params.id);
  const loggedInUserId = req.user.id;

  if (requestedId !== loggedInUserId) {
    return res.status(403).json({ message: 'Unauthorized access' });
  }

  const sql = 'SELECT id, name, username, email, mobile, address FROM users WHERE id = ?';
  db.query(sql, [requestedId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ user: results[0] });
  });
};

module.exports = { userGetData };
