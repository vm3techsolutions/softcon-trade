"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/api/axiosInstance";
import { useDispatch } from "react-redux";
import { adminSignupSuccess } from "@/app/store/adminAuthSlice";

const AdminSignupForm = () => {
  const [formData, setFormData] = useState({ name: "", username: "", email: "", password: "" });
  const router = useRouter();
  const dispatch = useDispatch();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/api/admin/signup", formData);
      dispatch(adminSignupSuccess(res.data));
      router.push("/admin/dashboard");
    } catch (err) {
      console.error("Signup Error:", err);
      alert("Signup failed.");
    }
  };

  // Optional: redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      router.push("/admin/dashboard");
    }
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />
      <input
  name="username"
  placeholder="Username"
  value={formData.username}
  onChange={handleChange}
  className="border p-2 w-full"
  required
/>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Sign Up
      </button>
    </form>
  );
};

export default AdminSignupForm;
