"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { signupSuccess } from "@/app/store/authSlice";
import { useRouter } from "next/navigation";
import axios from "axios"; // <--- axios imported

const SignupForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";

    if (!/^\d{10}$/.test(formData.mobile))
      newErrors.mobile = "Enter a valid 10-digit mobile number";

    if (!/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(formData.email))
      newErrors.email = "Enter a valid email address";

    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password))
      newErrors.password = "Password must include a special character";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!formData.address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const { confirmPassword, ...dataToSend } = formData;

    setLoading(true);
    try {
      const response = await axios.post(
  `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/signup`,
  dataToSend
);

      const result = response.data;
      dispatch(signupSuccess({ user: result.user, token: result.token }));
      localStorage.setItem("token", result.token); 
      alert("Signup successful!");
      router.push("/dashboard");
    } catch (error) {
      const msg =
        error?.response?.data?.message || "Signup failed. Please try again.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-10 bg-white border my-10 space-y-4"
      id="signup"
    >
      <h2 className="text-2xl font-bold text-center">Sign Up</h2>

      {[
        { name: "name", type: "text", placeholder: "Name" },
        { name: "username", type: "text", placeholder: "Username" },
        { name: "email", type: "email", placeholder: "Email" },
        { name: "mobile", type: "text", placeholder: "Mobile Number" },
        { name: "password", type: "password", placeholder: "Password" },
        { name: "confirmPassword", type: "password", placeholder: "Confirm Password" },
      ].map(({ name, type, placeholder }) => (
        <div key={name}>
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={formData[name]}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
        </div>
      ))}

      <div>
        <textarea
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full ${
          loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        } text-white py-2 rounded transition duration-300`}
      >
        {loading ? "Signing Up..." : "Sign Up"}
      </button>

      <p className="text-center text-sm mt-4">
        Already have an account?{" "}
        <Link href="/Login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
};

export default SignupForm;
