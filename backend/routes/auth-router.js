const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/auth');
const userRegister = require('../controller/userRegister/register');
const userGetData = require('../controller/userGetData/userGetData');
const adminRegister = require('../controller/adminRegister/adminRegister');
const { addProduct } = require('../controller/addProducts/addProducts');
const upload = require('../middleware/upload');
const { getCategories } = require('../controller/Categories/getCategories');
const { getAllProducts } = require('../controller/getProduct/getAllProduct');
const { getProductByCategory } = require('../controller/getProduct/getProductByCategory');
const { getProductById } = require('../controller/getProduct/getProductById');
const wiishListController = require('../controller/wishList/wishlistController');


// Define routes for user registration and login
router.post('/user/signup', userRegister.userSignUp);
router.post('/user/login', userRegister.userLogin);
// Define route for getting user data
router.get('/user/getData/:id', verifyToken, userGetData.userGetData);

// Admin routes
router.post('/admin/signup', adminRegister.adminSignUp);
router.post('/admin/login', adminRegister.adminLogin);
router.get('/admin/getData/:id', verifyToken, adminRegister.getAdminData);

// add products
router.post("/admin/addProduct", verifyToken ,upload.array("image", 10), addProduct);
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





module.exports = router;
