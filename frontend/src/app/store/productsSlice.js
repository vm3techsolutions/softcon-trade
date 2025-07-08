import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

// Fetch all products
export const fetchAllProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/getAllProducts");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to fetch products");
    }
  }
);

// Delete product
export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/admin/removeProduct/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to delete product");
    }
  }
);

// Update product
export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/updateProduct/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to update product");
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (b) => {
    b
      .addCase(fetchAllProducts.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchAllProducts.fulfilled, (s, a) => { s.loading = false; s.products = a.payload; })
      .addCase(fetchAllProducts.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(deleteProduct.fulfilled, (s, a) => {
        s.products = s.products.filter((p) => p.id !== a.payload);
      })
      .addCase(deleteProduct.rejected, (s, a) => { s.error = a.payload; })

      .addCase(updateProduct.fulfilled, (s, a) => {
        s.products = s.products.map((p) => (p.id === a.payload.id ? a.payload : p));
      })
      .addCase(updateProduct.rejected, (s, a) => { s.error = a.payload; });
  },
});

export default productsSlice.reducer;
