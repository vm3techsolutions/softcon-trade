import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import adminAuthReducer from "./adminAuthSlice";
import categoryReducer from "./categorySlice";
import productByCatReducer from "./productByCatSlice";
import cartReducer from "./cartSlice";
import wishlistReducer from "./wishlistSlice";
import fetchProductById from "./productByIdSlice";
import productsSlice from './productsSlice';
import usersSlice from './usersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminAuth: adminAuthReducer,
    categories: categoryReducer,
    products: productByCatReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    productById: fetchProductById,
    allProducts: productsSlice,
    allUsers: usersSlice,
  },
});
