const db = require("../../config/db");

// ✅ Get wishlist product IDs for a user
const getWishlistByUser = (req, res) => {
  const userId = req.params.userId;
  const sql = `SELECT product_id FROM wishlist WHERE user_id = ?`;
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Wishlist fetch error:", err);
      return res.status(500).json({ error: "Failed to fetch wishlist" });
    }

    const productIds = results.map((item) => item.product_id); // ✅ return product_id array
    res.json(productIds); // e.g. [1, 5, 7]
  });
};


const addToWishlist = (req, res) => {
  const { user_id, product_id } = req.body;

  console.log("Attempting to add to wishlist:", user_id, product_id);

  // Step 1: Check if the product already exists in the user's wishlist
  const checkSql = `SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?`;
  db.query(checkSql, [user_id, product_id], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Error checking wishlist:", checkErr);
      return res.status(500).json({ error: "Error checking wishlist" });
    }

    if (checkResult.length > 0) {
      // Product already exists
      return res.status(200).json({
        message: "Product already in wishlist",
        product_id,
      });
    }

    // Step 2: If not exists, insert the product into wishlist
    const insertSql = `INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)`;
    db.query(insertSql, [user_id, product_id], (insertErr, insertResult) => {
      if (insertErr) {
        console.error("Error adding to wishlist:", insertErr);
        return res.status(500).json({ error: "Failed to add to wishlist" });
      }

      res.status(201).json({
        message: "Product added to wishlist",
        product_id,
      });
    });
  });
};




// Remove product from wishlist
const removeFromWishlist = (req, res) => {
  const { user_id, product_id } = req.body;
  const sql = `DELETE FROM wishlist WHERE user_id = ? AND product_id = ?`;
  db.query(sql, [user_id, product_id], (err, result) => {
    if (err) {
      console.error("Remove from wishlist error:", err);
      return res.status(500).json({ error: "Failed to remove from wishlist" });
    }
    res.json({ message: "Product removed from wishlist", product_id });
  });
};

module.exports = {
  getWishlistByUser,
  addToWishlist,
  removeFromWishlist,
};
