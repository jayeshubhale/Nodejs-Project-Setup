const express = require('express');
const Router = express.Router();

const UserController = require('../controllers/UserController');

Router.post('/userRegester', UserController.userRegister);
Router.delete('/userDelete/:id', UserController.userDelete);
Router.get('/getUserById/:id', UserController.getUserById);
Router.get('/getAllUsers', UserController.getAllUsers);



Router.post('/userLogin', UserController.userLogin);



module.exports = Router;

