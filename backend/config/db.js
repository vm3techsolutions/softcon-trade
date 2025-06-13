// db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',         // or 127.0.0.1
  user: 'root',              // your MySQL username
  password: '',              // your MySQL password (empty if not set)
  database: 'softcon_trade'  // replace with your DB name
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database.');
  }
});

module.exports = connection;
