const db = require("../../config/db");

const getProductById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      p.id, p.name, p.slug, p.description, p.price, p.stock, p.image_url, p.category,
      GROUP_CONCAT(DISTINCT pi.image_url) AS gallery_images,
      GROUP_CONCAT(DISTINCT pc.category_id) AS category_ids
    FROM products p
    LEFT JOIN product_images pi ON pi.product_id = p.id
    LEFT JOIN product_categories pc ON pc.product_id = p.id
    WHERE p.id = ?
    GROUP BY p.id
    LIMIT 1
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Get Product By ID Error:", err);
      return res.status(500).json({ error: "Failed to fetch product" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    const prod = results[0];
    const formatted = {
      ...prod,
      gallery_images: prod.gallery_images ? prod.gallery_images.split(',') : [],
      category_ids: prod.category_ids ? prod.category_ids.split(',') : []
    };
    res.json(formatted);
  });
};

module.exports = { getProductById };