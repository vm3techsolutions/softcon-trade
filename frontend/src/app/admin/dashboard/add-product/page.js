"use client";

import { useState } from "react";
import axiosInstance from "@/app/api/axiosInstance";
import { useRouter } from "next/navigation";

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    price: "",
    stock: "",
    category: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [description, setDescription] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();
      Object.entries({ ...formData, description }).forEach(([key, value]) => {
        form.append(key, value);
      });
      if (imageFile) {
        form.append("image", imageFile);
      }

      await axiosInstance.post("/api/admin/products", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product added successfully!");
      router.push("/admin/dashboard");
    } catch (err) {
      console.error("Error adding product:", err);
      alert("Failed to add product. Check console for details.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-4 bg-white shadow rounded">
      <table className="w-full table-auto space-y-4">
        <tbody className="divide-y">
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
            <td className="py-2 font-medium">Slug:</td>
            <td className="py-2">
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </td>
          </tr>
          <tr>
            <td className="py-2 font-medium align-top">Description:</td>
            <td className="py-2">
              <textarea
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full border p-2 rounded"
                placeholder="Enter product description"
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
            <td className="py-2 font-medium">Image:</td>
            <td className="py-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border p-2 rounded"
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
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
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
                Add Product
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  );
};

export default AddProductForm;
