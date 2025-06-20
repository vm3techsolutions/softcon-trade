import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import adminAuthReducer from "./adminAuthSlice";
import categoryReducer from "./categorySlice";
import productByCatReducer from "./productByCatSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminAuth: adminAuthReducer,
    categories: categoryReducer,
    products: productByCatReducer,
  },
});
