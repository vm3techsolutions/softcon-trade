const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/auth');
const userRegister = require('../controller/userRegister/register');
const userGetData = require('../controller/userGetData/userGetData');
const adminRegister = require('../controller/adminRegister/adminRegister');


// Define routes for user registration and login
router.post('/user/signup', userRegister.userSignUp);
router.post('/user/login', userRegister.userLogin);
// Define route for getting user data
router.get('/user/getData/:id', verifyToken, userGetData.userGetData);

// Admin routes
router.post('/admin/signup', adminRegister.adminSignUp);
router.post('/admin/login', adminRegister.adminLogin);
router.get('/admin/getData/:id', verifyToken, adminRegister.getAdminData);


module.exports = router;
