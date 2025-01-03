const express = require('express');
const { updateTermsCondition, getTermsConditions } = require('../Controllers/termConditionController');


const Router = express.Router();

Router.put('/termsConditions', updateTermsCondition)
Router.get('/getTermsConditions', getTermsConditions)

module.exports = Router;