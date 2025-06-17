require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const router = require('./routes/auth-router');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONT_END_URL || "http://localhost:3000",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // For form data

// Static Files
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Routes
app.use('/api', router);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
