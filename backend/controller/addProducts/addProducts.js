const db = require("../../config/db");
require("dotenv").config();
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../../config/aws");

const uploadToS3 = async (file, categorySlug) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `uploads/images/${categorySlug}/${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const command = new PutObjectCommand(params);
  await s3.send(command);
  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
};

const addProduct = (req, res) => {
  let { name, description, price, stock, category_id, subcategory_id } = req.body;
  const files = req.files || [];
  const file = files.length > 0 ? files[0] : null;

  subcategory_id = !subcategory_id || subcategory_id === "NULL" ? null : subcategory_id;

  db.query("SELECT name FROM categories WHERE id = ?", [category_id], async (err, categoryData) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (!categoryData.length) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const category = categoryData[0].name;
    const categorySlug = category.toLowerCase().replace(/\s+/g, "-");

    if (!file) {
      return res.status(400).json({ error: "Main image is required" });
    }

    try {
      const image_url = await uploadToS3(file, categorySlug);

      const slugify = (text) =>
        text.toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      const slug = slugify(name);

      db.query(
        "INSERT INTO products (name, slug, description, price, stock, image_url, category) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [name, slug, description, price, stock, image_url, category],
        (err, productResult) => {
          if (err) {
            console.error("Insert Product Error:", err);
            return res.status(500).json({ error: "Failed to insert product" });
          }

          const productId = productResult.insertId;

          // Insert main category
          db.query(
            "INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)",
            [productId, category_id],
            (err) => {
              if (err) {
                console.error("Insert Category Error:", err);
                return res.status(500).json({ error: "Failed to insert main category" });
              }

              // Insert subcategory if present
              if (subcategory_id) {
                db.query(
                  "INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)",
                  [productId, subcategory_id],
                  (err) => {
                    if (err) {
                      console.error("Insert Subcategory Error:", err);
                      return res.status(500).json({ error: "Failed to insert subcategory" });
                    }
                  }
                );
              }
            }
          );

          // Upload additional images (skip first file)
          const additionalImages = files.slice(1);
          if (additionalImages.length > 0) {
            let completed = 0;

            additionalImages.forEach(async (img) => {
              try {
                const imageUrl = await uploadToS3(img, categorySlug);
                db.query(
                  "INSERT INTO product_images (product_id, image_url) VALUES (?, ?)",
                  [productId, imageUrl],
                  (err) => {
                    if (err) {
                      console.error("Insert product image error:", err);
                    }

                    completed++;
                    if (completed === additionalImages.length) {
                      return res.json({ success: true, message: "Product with images added!" });
                    }
                  }
                );
              } catch (imgErr) {
                console.error("Extra image upload failed:", imgErr);
              }
            });
          } else {
            return res.json({ success: true, message: "Product added!" });
          }
        }
      );
    } catch (mainErr) {
      console.error("Main Image Upload Failed:", mainErr);
      return res.status(500).json({ error: "Main image upload failed" });
    }
  });
};

module.exports = {
  addProduct,
};
