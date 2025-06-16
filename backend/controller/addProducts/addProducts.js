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
  let { name, description, price, stock, category_id, subcategory_id, category } = req.body;
  
  const file = req.file;

  subcategory_id = !subcategory_id || subcategory_id === "NULL" ? null : subcategory_id;

  // Get category slug first
  db.query("SELECT slug FROM categories WHERE id = ?", [category_id], async (err, categoryData) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (!categoryData.length) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const categorySlug = categoryData[0].slug;

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

                    return res.json({ success: true, message: "Product added!" });
                  }
                );
              } else {
                return res.json({ success: true, message: "Product added!" });
              }
            }
          );
        }
      );
    } catch (uploadErr) {
      console.error("S3 Upload Error:", uploadErr);
      return res.status(500).json({ error: "Image upload failed" });
    }
  });
};

module.exports = {
  addProduct,
};
