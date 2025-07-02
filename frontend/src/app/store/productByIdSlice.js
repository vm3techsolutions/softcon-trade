import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

// Thunk to fetch product by ID
export const fetchProductById = createAsyncThunk(
  "productById/fetchProductById",
  async (id) => {
    const response = await axiosInstance.get(`/api/products/${id}`);
    return response.data;
  }
);

const productByIdSlice = createSlice({
  name: "productById",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default productByIdSlice.reducer;