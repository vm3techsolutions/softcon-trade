const db = require("../../config/db");

const getProductByCategory = (req, res) => {
  const { category_id } = req.params;

  const sql = `
    SELECT 
      p.id, p.name, p.slug, p.description, p.price, p.stock, p.image_url, p.category,
      GROUP_CONCAT(DISTINCT pi.image_url) AS gallery_images
    FROM products p
    JOIN product_categories pc ON pc.product_id = p.id
    LEFT JOIN product_images pi ON pi.product_id = p.id
    WHERE pc.category_id = ?
    GROUP BY p.id
    ORDER BY p.id DESC
  `;

  db.query(sql, [category_id], (err, results) => {
    if (err) {
      console.error("Get Products By Category Error:", err);
      return res.status(500).json({ error: "Failed to fetch products" });
    }
    const formatted = results.map(prod => ({
      ...prod,
      gallery_images: prod.gallery_images ? prod.gallery_images.split(',') : []
    }));
    res.json(formatted);
  });
};

module.exports = { getProductByCategory };