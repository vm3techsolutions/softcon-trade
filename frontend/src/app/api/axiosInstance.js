import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const adminToken = localStorage.getItem("adminToken");
      const userToken = localStorage.getItem("token");

      const token = adminToken || userToken;

      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
        console.log("JWT Token attached:", token);
        console.log("Request headers:", config.headers);

      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;

        // Clear both tokens
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");

        // Redirect based on path
        if (currentPath.startsWith("/admin")) {
          window.location.href = "/admin/login";
        } else {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
