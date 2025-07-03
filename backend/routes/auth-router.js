const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/auth');
const userRegister = require('../controller/userRegister/register');
const userGetData = require('../controller/userGetData/userGetData');
const adminRegister = require('../controller/adminRegister/adminRegister');
const addProductsController = require('../controller/addProducts/addProducts');
const upload = require('../middleware/upload');
const { getCategories } = require('../controller/Categories/getCategories');
const { getAllProducts } = require('../controller/getProduct/getAllProduct');
const { getProductByCategory } = require('../controller/getProduct/getProductByCategory');
const { getProductById } = require('../controller/getProduct/getProductById');
const wiishListController = require('../controller/wishList/wishlistController');
const cartController = require('../controller/cart/cartController');
const orderController = require('../controller/order/orderController');

// Define routes for user registration and login
router.post('/user/signup', userRegister.userSignUp);
router.post('/user/login', userRegister.userLogin);

// Password reset routes
router.post("/forgot-password", userRegister.forgotPassword);
router.post("/reset-password", userRegister.resetPassword);
// Define route for getting user data
router.get('/user/getData/:id', verifyToken, userGetData.userGetData);

// Admin routes
router.post('/admin/signup', adminRegister.adminSignUp);
router.post('/admin/login', adminRegister.adminLogin);
router.get('/admin/getData/:id', verifyToken, adminRegister.getAdminData);

// add products
router.post("/admin/addProduct", verifyToken ,upload.array("image", 10), addProductsController.addProduct);

// Update product (PUT): /api/products/:id
router.put("/products/:id", verifyToken, upload.array("image", 10), addProductsController.updateProduct);

// Remove product (DELETE): /api/products/:id
router.delete("/products/:id",verifyToken, addProductsController.removeProduct);

// Get all products
router.get('/getAllProducts', getAllProducts);
// Get product by category
router.get('/products/category/:category_id', getProductByCategory);
// Get product by ID
router.get('/products/:id', getProductById);

// Get categories
router.get('/categories', getCategories);

// Wishlist routes
router.get('/wishlist/:userId', verifyToken, wiishListController.getWishlistByUser);
router.post('/wishlist/add', verifyToken, wiishListController.addToWishlist);
router.delete('/wishlist/remove', verifyToken, wiishListController.removeFromWishlist);

// Cart routes
router.get("/cart/:userId", verifyToken, cartController.getCart);
router.post("/cart/add", verifyToken, cartController.addToCart);
router.put("/cart/update", verifyToken, cartController.updateCartItem);
router.delete("/cart/remove", verifyToken, cartController.removeFromCart);
router.post("/cart/clear", verifyToken, cartController.clearCart);
router.post("/cart/merge", cartController.mergeCart);

// Order routes
router.post("/orders", verifyToken, orderController.createOrder);
router.get("/orders/user/:user_id", verifyToken, orderController.getOrdersByUser);
router.get("/orders/:order_id", verifyToken, orderController.getOrderDetails);


module.exports = router;
