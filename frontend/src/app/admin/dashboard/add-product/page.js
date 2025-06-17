'use client';

import React, { useState, useEffect } from 'react';
import axiosInstance from '@/app/api/axiosInstance';

const AddProductForm = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    subcategory_id: '',
    category: '',
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get('/api/admin/categories');

      setCategories(res.data);
      console.log(res.data);
      
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  fetchCategories();
}, []);


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

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value || '');
    });
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      await axiosInstance.post('/api/admin/addProduct', data, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

      alert('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product.');
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
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </td>
          </tr>
          {/* <tr>
            <td className="py-2 font-medium">Subcategory ID:</td>
            <td className="py-2">
              <input
                type="text"
                name="subcategory_id"
                value={formData.subcategory_id}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </td>
          </tr> */}
          {/* <tr>
            <td className="py-2 font-medium">Category (Slug):</td>
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
          </tr> */}
          <tr>
            <td className="py-2 font-medium">Image:</td>
            <td className="py-2">
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
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
