// store/productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

// Thunk for fetching products
export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchByCategory",
  async (categoryId) => {
    if (!categoryId || categoryId === "all") {
      const res = await axiosInstance.get("/api/getAllProducts");
      return res.data;
    }
    const res = await axiosInstance.get(`/api/products/category/${categoryId}`);
    return res.data;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    allProducts: [], // ✅ MUST be initialized
    data: [],        // filtered or shown data
    loading: false,
    error: null,
  },
  reducers: {
    searchProducts: (state, action) => {
      const query = action.payload.toLowerCase();

      // ✅ Add a safety check here too
      if (!state.allProducts) {
        state.data = [];
        return;
      }

      state.data = state.allProducts.filter((product) => {
        return (
          product.name?.toLowerCase().includes(query) ||
          product.categoryName?.toLowerCase().includes(query)
        );
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.data = [];
        state.allProducts = [];
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.allProducts = action.payload;
        state.data = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { searchProducts } = productSlice.actions;

export default productSlice.reducer;
