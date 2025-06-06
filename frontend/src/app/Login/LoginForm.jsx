"use client";

import React, { useState } from "react";
import Link from "next/link";

const LoginForm = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setLoginData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log("Login Data:", loginData);
    // TODO: backend API call here
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-10 bg-white  space-y-4  border my-10"
    >
      <h2 className="text-2xl font-bold text-center">Login</h2>

      <div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={loginData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
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
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
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
