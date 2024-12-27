const express = require('express');
const Router = express.Router();
// const commonMidd = require('../middleware/verifyToken');
// const check_body = require('../middleware/checkBody');
const Admin = require('../controllers/AdminController');


// Router.post('/createAdmin', [check_body.check_body], Admin.createAdmin);
// Router.post('/adminLogin', [check_body.login], Admin.admin_login);
// Router.put('/updateAdmin', [commonMidd.authenticateUser, check_body.update], Admin.update_admin);
// Router.put('/update_admin_image', [commonMidd.authenticateUser], Admin.update_admin_image);
// Router.put('/updatePassword', [commonMidd.authenticateUser, check_body.password], Admin.change_password);
// Router.get('/getAdminProfile', [commonMidd.authenticateUser], Admin.getAdminProfile);

module.exports = Router;

