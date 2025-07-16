const db = require("../../config/db");

// Get all users
const getAllUsers = (req, res) => {
  db.query("SELECT id, name, email, mobile, address  FROM users ORDER BY id ASC", (err, results) => {
    if (err) {
      console.error("Error fetching users:", err); // Optional: for debugging
      return res.status(500).json({ error: "Failed to fetch users" });
    }
    res.json(results);
  });
};



// Delete user
// const deleteUser = (req, res) => {
//   const { id } = req.params;
//   db.query("DELETE FROM users WHERE id = ?", [id], (err) => {
//     if (err) return res.status(500).json({ error: "Failed to delete user" });
//     res.json({ success: true });
//   });
// };

module.exports = {
  // ...other exports
  getAllUsers,
  // deleteUser,
};