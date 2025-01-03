const express = require('express');
const { updatePrivacyPolicy, getPrivecyPolicy, updateAboutUs, getAboutUs } = require('../Controllers/privecyPolicyController');


const Router = express.Router();

Router.put('/privecyPolicy', updatePrivacyPolicy)
Router.get('/getPrivecyPolicy', getPrivecyPolicy)
Router.put('/AddAboutUs', updateAboutUs)
Router.get('/getAboutUs', getAboutUs)



module.exports = Router;