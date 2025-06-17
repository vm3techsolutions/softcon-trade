const db = require("../../config/db");

const getCategories = (req, res) => {
  db.query("SELECT * FROM categories", (err, results) => {
    if (err) {
      console.error("Query error:", err);
      return res.status(500).json({ error: "Failed to fetch categories" });
    }
    res.json(results);
  });
};

module.exports = {
  getCategories
};
