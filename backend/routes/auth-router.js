const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/auth');
const userRegister = require('../controller/userRegister/register');
const userGetData = require('../controller/userGetData/userGetData');


// Define routes for user registration and login
router.post('/user/signup', userRegister.userSignUp);
router.post('/user/login', userRegister.userLogin);
// Define route for getting user data
router.get('/user/getData/:id', verifyToken, userGetData.userGetData);


module.exports = router;
