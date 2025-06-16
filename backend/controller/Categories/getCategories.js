const db = require("../../config/db");
// getCategories.js
const getCategories= async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM categories");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};


module.exports = {
  getCategories
};