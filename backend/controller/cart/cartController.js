const db = require("../../config/db");

// Get or create cart for user
const getOrCreateCart = (user_id, cb) => {
  db.query("SELECT * FROM carts WHERE user_id = ?", [user_id], (err, results) => {
    if (err) return cb(err);
    if (results.length > 0) return cb(null, results[0].id);

    db.query("INSERT INTO carts (user_id) VALUES (?)", [user_id], (err, result) => {
      if (err) return cb(err);
      cb(null, result.insertId);
    });
  });
};

// Get cart items for user
const getCart = (req, res) => {
  const user_id = req.params.userId;
  getOrCreateCart(user_id, (err, cart_id) => {
    if (err) return res.status(500).json({ error: "DB error" });
    db.query(
      `SELECT ci.id, ci.product_id, ci.quantity, p.name, p.price, p.image_url
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = ?`,
      [cart_id],
      (err, items) => {
        if (err) return res.status(500).json({ error: "DB error" });
        res.json(items);
      }
    );
  });
};

// Add/update item in cart
const addToCart = (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  getOrCreateCart(user_id, (err, cart_id) => {
    if (err) return res.status(500).json({ error: "DB error" });
    db.query(
      "SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?",
      [cart_id, product_id],
      (err, results) => {
        if (err) return res.status(500).json({ error: "DB error" });
        if (results.length > 0) {
          db.query(
            "UPDATE cart_items SET quantity = quantity + ? WHERE id = ?",
            [quantity, results[0].id],
            (err) => {
              if (err) return res.status(500).json({ error: "DB error" });
              res.json({ message: "Cart updated" });
            }
          );
        } else {
          db.query(
            "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)",
            [cart_id, product_id, quantity],
            (err) => {
              if (err) return res.status(500).json({ error: "DB error" });
              res.json({ message: "Added to cart" });
            }
          );
        }
      }
    );
  });
};

// Update quantity
const updateCartItem = (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  getOrCreateCart(user_id, (err, cart_id) => {
    if (err) return res.status(500).json({ error: "DB error" });
    db.query(
      "UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?",
      [quantity, cart_id, product_id],
      (err) => {
        if (err) return res.status(500).json({ error: "DB error" });
        res.json({ message: "Quantity updated" });
      }
    );
  });
};

// Remove item
const removeFromCart = (req, res) => {
  const { user_id, product_id } = req.body;
  getOrCreateCart(user_id, (err, cart_id) => {
    if (err) return res.status(500).json({ error: "DB error" });
    db.query(
      "DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?",
      [cart_id, product_id],
      (err) => {
        if (err) return res.status(500).json({ error: "DB error" });
        res.json({ message: "Removed from cart" });
      }
    );
  });
};

// Clear cart
const clearCart = (req, res) => {
  const { user_id } = req.body;
  getOrCreateCart(user_id, (err, cart_id) => {
    if (err) return res.status(500).json({ error: "DB error" });
    db.query(
      "DELETE FROM cart_items WHERE cart_id = ?",
      [cart_id],
      (err) => {
        if (err) return res.status(500).json({ error: "DB error" });
        res.json({ message: "Cart cleared" });
      }
    );
  });
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};