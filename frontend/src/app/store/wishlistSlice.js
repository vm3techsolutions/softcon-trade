import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

// ✅ Fetch wishlist
export const fetchWishlist = createAsyncThunk("wishlist/fetch", async (userId) => {
  const response = await axiosInstance.get(`/wishlist/${userId}`);
  return response.data; // e.g. [1, 5, 7]
});

// ✅ Add to wishlist
export const addToWishlist = createAsyncThunk("wishlist/add", async ({ userId, productId }) => {
  await axiosInstance.post("/wishlist/add", { user_id: userId, product_id: productId });
  return productId;
});

// ✅ Remove from wishlist
export const removeFromWishlist = createAsyncThunk("wishlist/remove", async ({ userId, productId }) => {
  await axiosInstance.delete("/wishlist/remove", {
    data: { user_id: userId, product_id: productId },
  });
  return productId;
});

// ✅ Slice
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        console.log("Fetched wishlist data:", action.payload);
        state.items = action.payload; // ✅ Already an array of product IDs
        state.loading = false;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        if (!state.items.includes(action.payload)) {
          state.items.push(action.payload);
        }
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter((id) => id !== action.payload);
      });
  },
});

export default wishlistSlice.reducer;