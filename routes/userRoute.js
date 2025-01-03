const express = require('express');
const Router = express.Router();

const UserController = require('../controllers/UserController');
const commonMidd = require('../middleware/verifyToken');



// ----------------------
Router.post('/userRegester', UserController.userRegister);
Router.post('/userLogin', UserController.userLogin);
Router.post('/google/login', UserController.createGoogle);
Router.post('/facebook/login', UserController.createFacebook);
// ----------------------

Router.delete('/userDelete/:id', UserController.userDelete);
Router.get('/getUserById/:id', UserController.getUserById);
Router.get('/getAllUsers', UserController.getAllUsers);

Router.put('/OTPVerified', UserController.OTPVerified);
Router.put('/OTPEmailSent', UserController.OTPEmailSent);
Router.put('/ResendOTP', UserController.ResendOTP);
Router.put('/forgotPassword', UserController.forgotPassword);
Router.put('/forgetPassOtpVerify', UserController.forgetPassOtpVerify);
Router.put('/resetPassword', UserController.resetPassword);

// -------------------------------
// --- Profile --- //

Router.get('/getProfile', [commonMidd.UserForauthenticateUser], UserController.getProfile);
Router.put('/postContactUs', UserController.postContactUs);
Router.put('/changePassword', [commonMidd.UserForauthenticateUser], UserController.changePassword);



module.exports = Router;

