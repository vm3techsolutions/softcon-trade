'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts, deleteProduct } from '@/app/store/productsSlice';
import axiosInstance from '@/app/api/axiosInstance';

export default function ProductList() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.allProducts);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const handleDelete = async (id) => {
    const confirmed = confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;

    try {
      await axiosInstance.delete(`/products/${id}`);
      dispatch(deleteProduct(id));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleEdit = (id) => {
    alert(`Edit product with ID: ${id}`);
    // Implement navigation or modal for editing here
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!products) return <p>No products data.</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Product ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Price (₹ / 1 piece)</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product, index) => (
                <tr key={product.id} className="text-center border-t">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{product.id}</td>
                  <td className="px-4 py-2 border">{product.name}</td>
                  <td className="px-4 py-2 border">{product.category}</td>
                  <td className="px-4 py-2 border">{product.price}</td>
                  <td className="px-4 py-2 border space-x-2">
                    <button
                      onClick={() => handleEdit(product.id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
