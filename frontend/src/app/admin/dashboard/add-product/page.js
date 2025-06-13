"use client";

import { useState } from "react";
import axiosInstance from "@/app/api/axiosInstance";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    price: "",
    stock: "",
    category: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const router = useRouter();

  // Setup Tiptap editor for rich text
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Hello World</p>",
    onUpdate: ({ editor }) => {
      // Save editor HTML content in formData
      setDescription(editor.getHTML());
    },
  });

  const [description, setDescription] = useState("");

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
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto p-4">
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full border p-2"
        required
      />
      <input
        type="text"
        name="slug"
        placeholder="Slug"
        value={formData.slug}
        onChange={handleChange}
        className="w-full border p-2"
        required
      />

      {/* Description field using Tiptap */}
      <div className="w-full border p-2 min-h-[150px]">
        <EditorContent editor={editor} />
      </div>

      <input
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
        className="w-full border p-2"
        step="0.01"
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full border p-2"
        required
      />
      <input
        type="number"
        name="stock"
        placeholder="Stock"
        value={formData.stock}
        onChange={handleChange}
        className="w-full border p-2"
        required
      />
      <input
        type="text"
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleChange}
        className="w-full border p-2"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Product
      </button>
    </form>
  );
};

export default AddProductForm;
