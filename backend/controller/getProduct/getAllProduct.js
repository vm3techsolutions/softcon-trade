
const db = require("../../config/db");

// Get all products
const getAllProducts = (req, res) => {
  const sql = `
    SELECT 
      p.id, p.name, p.slug, p.description, p.price, p.stock, p.image_url, p.category, 
      GROUP_CONCAT(DISTINCT pi.image_url) AS gallery_images,
      GROUP_CONCAT(DISTINCT pc.category_id) AS category_ids
    FROM products p
    LEFT JOIN product_images pi ON pi.product_id = p.id
    LEFT JOIN product_categories pc ON pc.product_id = p.id
    GROUP BY p.id
    ORDER BY p.id DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Get Products Error:", err);
      return res.status(500).json({ error: "Failed to fetch products" });
    }
    // Format gallery_images as array
    const formatted = results.map(prod => ({
      ...prod,
      gallery_images: prod.gallery_images ? prod.gallery_images.split(',') : [],
      category_ids: prod.category_ids ? prod.category_ids.split(',') : []
    }));
    res.json(formatted);
  });
};

module.exports = {
  getAllProducts
};