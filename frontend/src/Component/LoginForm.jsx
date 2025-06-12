"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/app/store/authSlice";
import axiosInstance from "@/app/api/axiosInstance";

const LoginForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    setLoginData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setServerError("");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(loginData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (loginData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(loginData.password)) {
      newErrors.password = "Password must include at least one special character";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axiosInstance.post("/api/user/login", {
  email: loginData.email,
  password: loginData.password,
});

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      dispatch(loginSuccess({ user, token }));
      router.push("/dashboard");
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Try again.";
      setServerError(message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-10 bg-white border my-10 space-y-4"
    >
      <h2 className="text-2xl font-bold text-center">Login</h2>

      {serverError && (
        <p className="text-red-600 text-sm text-center">{serverError}</p>
      )}

      <div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={loginData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      <div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={loginData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
      >
        Login
      </button>

      <div className="flex justify-between text-sm mt-4">
        <Link href="/forgot-password" className="text-blue-600 hover:underline">
          Forgot Password?
        </Link>
        <Link href="/SignUp" className="text-blue-600 hover:underline">
          Create Account
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
