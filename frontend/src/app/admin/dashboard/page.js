"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import AddProductForm from "./add-product/page"; // Adjust path as needed

const AdminDashboard = () => {
  const router = useRouter();
  const adminUser = useSelector((state) => state.adminAuth.user);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) return <p className="text-center mt-8">Loading...</p>;

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            Welcome, {adminUser?.name || adminUser?.username || "Admin"}!
          </h1>

          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            {showForm ? "Close" : "Add Product"}
          </button>
        </div>

        {showForm && (
          <div className="mt-4 border-t pt-6">
            <AddProductForm />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
