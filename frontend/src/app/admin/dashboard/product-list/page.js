'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllProducts,
  deleteProduct,
  updateProduct
} from '@/app/store/productsSlice';
import axiosInstance from '@/app/api/axiosInstance';

export default function ProductList() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.allProducts);

  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", stock: "" });

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const startEdit = (p) => {
    setEditId(p.id);
    setForm({ name: p.name, price: p.price, stock: p.stock });
  };

  const cancelEdit = () => setEditId(null);

  const submitEdit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("price", form.price);
    fd.append("stock", form.stock);
    dispatch(updateProduct({ id: editId, formData: fd }));
    setEditId(null);
  };

  const handleDelete = (id) => {
    if (confirm("Delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border">
          <thead className="bg-gray-100">
            <tr>
              <th>#</th>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">No products found.</td>
              </tr>
            ) : (
              products.map((p, i) => (
                <tr key={p.id} className="text-center border-t">
                  <td>{i + 1}</td>
                  <td>{p.id}</td>
                  <td>
                    {editId === p.id ? (
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="border px-1"
                      />
                    ) : (
                      p.name
                    )}
                  </td>
                  <td>
                    {editId === p.id ? (
                      <input
                        type="number"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        className="border w-20"
                      />
                    ) : (
                      p.price
                    )}
                  </td>
                  <td>
                    {editId === p.id ? (
                      <input
                        type="number"
                        value={form.stock}
                        onChange={(e) => setForm({ ...form, stock: e.target.value })}
                        className="border w-20"
                      />
                    ) : (
                      p.stock
                    )}
                  </td>
                  <td className="space-x-2">
                    {editId === p.id ? (
                      <>
                        <button
                          onClick={submitEdit}
                          className="px-3 py-1 bg-green-600 text-white rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-1 bg-gray-600 text-white rounded"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(p)}
                          className="px-3 py-1 bg-blue-500 text-white rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded"
                        >
                          Delete
                        </button>
                      </>
                    )}
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
