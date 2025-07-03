'use client';

import React, { useState, useEffect } from 'react';
import axiosInstance from '@/app/api/axiosInstance';

const AddProductForm = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    subcategory_id: '',
  });

  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]); // for multiple gallery images

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get('/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const parentCategories = categories.filter(cat => cat.parent_id === null);
  const allSubcategories = categories.filter(cat => cat.parent_id !== null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'category_id') {
      setFormData(prev => ({
        ...prev,
        category_id: value,
        subcategory_id: '', // reset on new parent
      }));
      const filteredSub = allSubcategories.filter(sub => sub.parent_id == value);
      setSubcategories(filteredSub);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value || '');
    });

    // Append main image first
    if (mainImage) data.append('image', mainImage);

    // Append gallery images (if any)
    galleryImages.forEach((img) => data.append('image', img));

    try {
      await axiosInstance.post('/admin/addProduct', data, {
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

          {/* Parent Category Dropdown */}
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
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </td>
          </tr>

          {/* Subcategory Dropdown */}
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

          <tr>
            <td className="py-2 font-medium">Product Image:</td>
            <td className="py-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setMainImage(e.target.files[0])}
                className="w-full border p-2 rounded"
                required
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
