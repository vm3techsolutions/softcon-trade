import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import adminAuthReducer from "./adminAuthSlice";
import categoryReducer from "./categorySlice";
import productByCatReducer from "./productByCatSlice";
import wishlistReducer from "./wishlistSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminAuth: adminAuthReducer,
    categories: categoryReducer,
    products: productByCatReducer,
    wishlist: wishlistReducer, // ✅ lowercase w
  },
});
