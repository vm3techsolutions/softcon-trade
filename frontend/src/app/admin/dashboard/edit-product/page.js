"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { updateProduct } from "@/app/store/productsSlice";
import { fetchProductById } from "@/app/store/productByIdSlice";
import { fetchCategories } from "@/app/store/categorySlice";

const EditProduct = ({ productId, onBack }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { data: categories, loading: categoriesLoading, error: categoriesError } = useSelector((state) => state.categories);

  const [loading, setLoading] = useState(true);
  const [subcategories, setSubcategories] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    subcategory_id: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchCategories()).unwrap();
        const product = await dispatch(fetchProductById(productId)).unwrap();

        const subs = product.category_id
          ? categories.filter((sub) => sub.parent_id == product.category_id)
          : [];

        setSubcategories(subs);

        setFormData({
          name: product.name || "",
          description: product.description || "",
          price: product.price || "",
          stock: product.stock || "",
          category_id: product.category_id?.toString() || "",
          subcategory_id: product.subcategory_id?.toString() || "",
        });

        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    if (productId) {
      fetchData();
    }
  }, [productId, dispatch, categories.length]);

  const parentCategories = categories.filter((cat) => cat.parent_id === null || cat.parent_id === 0);
  const allSubcategories = categories.filter((cat) => cat.parent_id !== null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "category_id") {
      setFormData((prev) => ({
        ...prev,
        category_id: value,
        subcategory_id: "",
      }));
      const filteredSub = allSubcategories.filter((sub) => sub.parent_id == value);
      setSubcategories(filteredSub);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    if (mainImage) {
      data.append("image", mainImage);
    }

    galleryImages.forEach((img) => data.append("image", img));

    try {
      await dispatch(updateProduct({ id: productId, formData: data })).unwrap();
      alert("Product updated successfully!");
      onBack();
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update product.");
    }
  };

  if (loading || categoriesLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white shadow rounded">
      <div className="mb-4">
        <button
          type="button"
          onClick={onBack}
          className="text-blue-600 hover:underline"
        >
          ← Back to Product List
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <table className="w-full table-auto space-y-4">
          <tbody className="divide-y">
            {/* Product Fields */}
            <tr>
              <td className="py-2 font-medium w-1/3">Product Name:</td>
              <td className="py-2">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </td>
            </tr>
            <tr>
              <td className="py-2 font-medium">Description:</td>
              <td className="py-2">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full border p-2 rounded"
                  required
                />
              </td>
            </tr>
            <tr>
              <td className="py-2 font-medium">Price:</td>
              <td className="py-2">
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  step="0.01"
                  required
                />
              </td>
            </tr>
            <tr>
              <td className="py-2 font-medium">Stock:</td>
              <td className="py-2">
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </td>
            </tr>
            <tr>
              <td className="py-2 font-medium">Category:</td>
              <td className="py-2">
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="">Select Category</option>
                  {parentCategories.map((cat) => (
                    <option key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>

            {subcategories.length > 0 && (
              <tr>
                <td className="py-2 font-medium">Subcategory:</td>
                <td className="py-2">
                  <select
                    name="subcategory_id"
                    value={formData.subcategory_id}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  >
                    <option value="">Select Subcategory</option>
                    {subcategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            )}

            {/* Images */}
            <tr>
              <td className="py-2 font-medium">Product Image:</td>
              <td className="py-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setMainImage(e.target.files[0])}
                  className="w-full border p-2 rounded"
                />
              </td>
            </tr>
            <tr>
              <td className="py-2 font-medium">Product Gallery:</td>
              <td className="py-2">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setGalleryImages(Array.from(e.target.files))}
                  className="w-full border p-2 rounded"
                />
              </td>
            </tr>
            <tr>
              <td></td>
              <td className="pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Update Product
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
};

export default EditProduct;
