const express = require('express');
const Router = express.Router();
const commonMidd = require('../middleware/verifyToken');
const Admin = require('../controllers/AdminController');


Router.post('/adminLogin', Admin.admin_login);
Router.get('/adminDashboard', [commonMidd.authenticateUser], Admin.adminDashboard);
Router.get('/listOfUsers', [commonMidd.authenticateUser], Admin.listOfUsers);


// Router.post('/createAdmin', [check_body.check_body], Admin.createAdmin);
// Router.put('/updateAdmin', [commonMidd.authenticateUser, check_body.update], Admin.update_admin);
// Router.put('/update_admin_image', [commonMidd.authenticateUser], Admin.update_admin_image);
// Router.put('/updatePassword', [commonMidd.authenticateUser, check_body.password], Admin.change_password);
// Router.get('/getAdminProfile', [commonMidd.authenticateUser], Admin.getAdminProfile);


module.exports = Router;

