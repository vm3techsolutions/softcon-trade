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

// Update Product
// const updateProduct = async (req, res) => {
//   let { name, description, price, stock, category_id, subcategory_id } = req.body;
//   const files = req.files || [];
//   const file = files.length > 0 ? files[0] : null;
//   const { id } = req.params;

//   subcategory_id = !subcategory_id || subcategory_id === "NULL" ? null : subcategory_id;

//   db.query("SELECT name FROM categories WHERE id = ?", [category_id], async (err, categoryData) => {
//     if (err) {
//       console.error("DB Error:", err);
//       return res.status(500).json({ error: "Database error" });
//     }

//     if (!categoryData.length) {
//       return res.status(400).json({ error: "Invalid category ID" });
//     }

//     const category = categoryData[0].name;
//     const categorySlug = category.toLowerCase().replace(/\s+/g, "-");

//     let image_url = req.body.image_url; // fallback to existing image if not uploading new
//     if (file) {
//       try {
//         image_url = await uploadToS3(file, categorySlug);
//       } catch (mainErr) {
//         console.error("Main Image Upload Failed:", mainErr);
//         return res.status(500).json({ error: "Main image upload failed" });
//       }
//     }

//     const slugify = (text) =>
//       text.toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
//     const slug = slugify(name);

//     db.query(
//       "UPDATE products SET name=?, slug=?, description=?, price=?, stock=?, image_url=?, category=? WHERE id=?",
//       [name, slug, description, price, stock, image_url, category, id],
//       (err) => {
//         if (err) {
//           console.error("Update Product Error:", err);
//           return res.status(500).json({ error: "Failed to update product" });
//         }

//         // Update product_categories
//         db.query("DELETE FROM product_categories WHERE product_id = ?", [id], (err) => {
//           if (err) {
//             console.error("Delete old categories error:", err);
//           }
//           db.query(
//             "INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)",
//             [id, category_id],
//             (err) => {
//               if (err) {
//                 console.error("Insert main category error:", err);
//               }
//               if (subcategory_id) {
//                 db.query(
//                   "INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)",
//                   [id, subcategory_id],
//                   (err) => {
//                     if (err) {
//                       console.error("Insert subcategory error:", err);
//                     }
//                   }
//                 );
//               }
//             }
//           );
//         });

//         // Handle additional images (optional: clear and re-add, or just add new)
//         const additionalImages = files.slice(1);
//         if (additionalImages.length > 0) {
//           additionalImages.forEach(async (img) => {
//             try {
//               const imageUrl = await uploadToS3(img, categorySlug);
//               db.query(
//                 "INSERT INTO product_images (product_id, image_url) VALUES (?, ?)",
//                 [id, imageUrl],
//                 (err) => {
//                   if (err) {
//                     console.error("Insert product image error:", err);
//                   }
//                 }
//               );
//             } catch (imgErr) {
//               console.error("Extra image upload failed:", imgErr);
//             }
//           });
//         }

//         return res.json({ success: true, message: "Product updated!" });
//       }
//     );
//   });
// };

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const mainImageFile = req.files?.mainImage?.[0] || null;
  const galleryFilesMap = req.files || {};
  const galleryImageKeys = Object.keys(galleryFilesMap).filter((key) => key.startsWith("galleryImages["));

  const {
    name,
    description,
    price,
    stock,
    category_id,
    subcategory_id: rawSubcategoryId,
    image_url: fallbackImageUrl,
  } = req.body;

  const subcategory_id = !rawSubcategoryId || rawSubcategoryId === "NULL" ? null : rawSubcategoryId;

  // Get current product
  db.query("SELECT * FROM products WHERE id = ?", [id], async (err, productResult) => {
    if (err || !productResult.length) {
      return res.status(404).json({ error: "Product not found" });
    }

    const existing = productResult[0];

    const updatedName = name || existing.name;
    const updatedDescription = description || existing.description;
    const updatedPrice = price || existing.price;
    const updatedStock = stock || existing.stock;
    const updatedCategoryId = category_id || existing.category_id;
    let finalImageUrl = fallbackImageUrl || existing.image_url;

    // Get category name if updated or fallback to existing
    const resolveCategory = () =>
      new Promise((resolve, reject) => {
        if (category_id) {
          db.query("SELECT name FROM categories WHERE id = ?", [updatedCategoryId], (err, catRes) => {
            if (err) return reject("DB error validating category");
            if (!catRes.length) return reject("Invalid category ID");
            return resolve(catRes[0].name);
          });
        } else {
          resolve(existing.category); // fallback to existing category name
        }
      });

    try {
      const category = await resolveCategory();
      const categorySlug = category.toLowerCase().replace(/\s+/g, "-");

      // ✅ Upload main image only if provided
      if (mainImageFile) {
        try {
          finalImageUrl = await uploadToS3(mainImageFile, categorySlug);
        } catch (uploadErr) {
          return res.status(500).json({ error: "Main image upload failed" });
        }
      }

      const slugify = (text) =>
        text.toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      const slug = slugify(updatedName);

      // Update product table
      db.query(
        `UPDATE products SET name=?, slug=?, description=?, price=?, stock=?, image_url=?, category=? WHERE id=?`,
        [updatedName, slug, updatedDescription, updatedPrice, updatedStock, finalImageUrl, category, id],
        (err) => {
          if (err) return res.status(500).json({ error: "Failed to update product" });

          // Update product_categories if category_id/subcategory_id was provided
          if (category_id || subcategory_id) {
            db.query("DELETE FROM product_categories WHERE product_id = ?", [id], (err) => {
              if (err) console.error("Delete product categories failed:", err);

              if (category_id) {
                db.query(
                  "INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)",
                  [id, updatedCategoryId],
                  (err) => {
                    if (err) console.error("Insert main category failed:", err);
                  }
                );
              }

              if (subcategory_id) {
                db.query(
                  "INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)",
                  [id, subcategory_id],
                  (err) => {
                    if (err) console.error("Insert subcategory failed:", err);
                  }
                );
              }
            });
          }

          // ✅ Handle gallery image upload separately
          const existingImagesQuery = "SELECT id FROM product_images WHERE product_id = ? ORDER BY id ASC";
          db.query(existingImagesQuery, [id], async (err, existingImages) => {
            if (err) {
              console.error("Fetch existing gallery error", err);
              return res.status(500).json({ error: "Fetch gallery error" });
            }

            for (let key of galleryImageKeys) {
              const index = parseInt(key.match(/\[(\d+)\]/)[1]);
              const file = galleryFilesMap[key][0];
              try {
                const imageUrl = await uploadToS3(file, categorySlug);

                if (existingImages[index]) {
                  // Update existing image
                  db.query(
                    "UPDATE product_images SET image_url = ? WHERE id = ?",
                    [imageUrl, existingImages[index].id],
                    (err) => {
                      if (err) console.error("Update gallery failed:", err);
                    }
                  );
                } else {
                  // Insert new image
                  db.query(
                    "INSERT INTO product_images (product_id, image_url) VALUES (?, ?)",
                    [id, imageUrl],
                    (err) => {
                      if (err) console.error("Insert gallery failed:", err);
                    }
                  );
                }
              } catch (err) {
                console.error("Gallery image upload failed:", err);
              }
            }
          });

          return res.json({ success: true, message: "Product updated!" });
        }
      );
    } catch (errorMsg) {
      return res.status(400).json({ error: errorMsg });
    }
  });
};

// Remove Product
const removeProduct = (req, res) => {
  const { id } = req.params;
  // Remove product, its categories, and images
  db.query("DELETE FROM product_images WHERE product_id = ?", [id], (err) => {
    if (err) {
      console.error("Delete product images error:", err);
    }
    db.query("DELETE FROM product_categories WHERE product_id = ?", [id], (err) => {
      if (err) {
        console.error("Delete product categories error:", err);
      }
      db.query("DELETE FROM products WHERE id = ?", [id], (err) => {
        if (err) {
          console.error("Delete product error:", err);
          return res.status(500).json({ error: "Failed to delete product" });
        }
        return res.json({ success: true, message: "Product deleted!" });
      });
    });
  });
};

module.exports = {
  addProduct,
  updateProduct,
  removeProduct,
};
