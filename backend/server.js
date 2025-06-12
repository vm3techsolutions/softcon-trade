require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./db'); // database connection
const authRoutes = require('./routes/auth'); // auth route file
const cors = require('cors');
const userRoutes = require('./routes/user');

app.use(cors()); // enable CORS if frontend is on a different port
app.use(express.json()); // to parse JSON request bodies

// Use auth routes
app.use(authRoutes);
app.use(userRoutes);

// Example route to get all users
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch users' });
    } else {
      res.json(results);
    }
  });
});



app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
