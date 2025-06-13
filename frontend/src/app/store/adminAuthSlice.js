import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: null,
  token: null,
  isAuthenticated: false,
};

// Load from localStorage if available
if (typeof window !== "undefined") {
  try {
    const storedToken = localStorage.getItem("adminToken");
    const storedAdmin = localStorage.getItem("admin");

    if (storedToken && storedAdmin) {
      initialState.token = storedToken;
      initialState.admin = JSON.parse(storedAdmin);
      initialState.isAuthenticated = true;
    }
  } catch (error) {
    console.error("Error loading admin auth from localStorage:", error);
  }
}

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    adminLoginSuccess(state, action) {
      const { admin, token } = action.payload;
      state.admin = admin;
      state.token = token;
      state.isAuthenticated = true;

      if (typeof window !== "undefined") {
        localStorage.setItem("adminToken", token);
        localStorage.setItem("admin", JSON.stringify(admin));
      }
    },

    adminSignupSuccess(state, action) {
      const { admin, token } = action.payload;
      state.admin = admin;
      state.token = token;
      state.isAuthenticated = true;

      if (typeof window !== "undefined") {
        localStorage.setItem("adminToken", token);
        localStorage.setItem("admin", JSON.stringify(admin));
      }
    },

    adminLogout(state) {
      state.admin = null;
      state.token = null;
      state.isAuthenticated = false;

      if (typeof window !== "undefined") {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
      }
    },

    setAdmin(state, action) {
      const { admin, token } = action.payload;
      state.admin = admin;
      state.token = token;
      state.isAuthenticated = true;

      if (typeof window !== "undefined") {
        localStorage.setItem("adminToken", token);
        localStorage.setItem("admin", JSON.stringify(admin));
      }
    },
  },
});

export const {
  adminLoginSuccess,
  adminSignupSuccess,
  adminLogout,
  setAdmin,
} = adminAuthSlice.actions;

export default adminAuthSlice.reducer;
