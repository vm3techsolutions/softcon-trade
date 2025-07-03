import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

// ✅ Fetch Cart
export const fetchCart = createAsyncThunk("cart/fetch", async (userId) => {
  if (!userId) {
    const guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
    return guestCart;
  } else {
    const response = await axiosInstance.get(`/cart/${userId}`);
    return response.data;
  }
});

// Add to Cart
export const addToCart = createAsyncThunk("cart/add", async ({ userId, product }, { dispatch }) => {
  const quantity = product.quantity || 1;

  if (!userId) {
    const localCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
    const existing = localCart.find(item => item.product_id === product.product_id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      localCart.push({ ...product, quantity });
    }
    localStorage.setItem("guest_cart", JSON.stringify(localCart));
    return { ...product, quantity, guest: true };
  } else {
    const response = await axiosInstance.post("/cart/add", {
      user_id: userId,
      product_id: product.product_id,
      quantity,
    });
    return { ...product, quantity };
  }
});


// ✅ Merge Guest Cart to User Cart on Login
export const mergeGuestCart = createAsyncThunk("cart/merge", async (userId, { dispatch }) => {
  const guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];

  if (guestCart.length > 0 && userId) {
    await axiosInstance.post("/cart/merge", {
      userId,
      items: guestCart,
    });

    localStorage.removeItem("guest_cart");

    const response = await axiosInstance.get(`/cart/${userId}`);
    return response.data;
  }

  return [];
});

// ✅ Update Item Quantity
export const updateCartItem = createAsyncThunk("cart/update", async ({ userId, productId, quantity }) => {
  if (!userId) {
    const guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
    const updatedCart = guestCart.map(item =>
      item.product_id === productId ? { ...item, quantity } : item
    );
    localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
    return { productId, quantity };
  } else {
    await axiosInstance.put("/cart/update", {
      user_id: userId,
      product_id: productId,
      quantity,
    });
    return { productId, quantity };
  }
});

// ✅ Remove from Cart
export const removeFromCart = createAsyncThunk("cart/remove", async ({ userId, productId }) => {
  if (!userId) {
    const guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
    const updatedCart = guestCart.filter(item => item.product_id !== productId);
    localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
    return productId;
  } else {
    await axiosInstance.delete("/cart/remove", {
      data: { user_id: userId, product_id: productId },
    });
    return productId;
  }
});

// ✅ Clear Cart
export const clearCart = createAsyncThunk("cart/clear", async (userId) => {
  if (!userId) {
    localStorage.removeItem("guest_cart");
    return true;
  } else {
    await axiosInstance.post("/cart/clear", { user_id: userId });
    return true;
  }
});

// 🧩 Slice
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
  const item = action.payload;
  const existing = state.items.find(i => i.product_id === item.product_id);
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    state.items.push({ ...item });
  }
})

      .addCase(updateCartItem.fulfilled, (state, action) => {
        const { productId, quantity } = action.payload;
        const item = state.items.find(i => i.product_id === productId);
        if (item) item.quantity = quantity;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.product_id !== action.payload);
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
      })
      .addCase(mergeGuestCart.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export default cartSlice.reducer;
