
const express = require('express');

const router = express.Router();
const customerService = require('../controllers/customerService.js');
const {checkQueryParams, calculateDateRange, validateCustomerServiceData,
    validateUser, validateRestaurant, validateDriver} = require('../middleware');

router.route('/')
    .get(checkQueryParams, calculateDateRange, customerService.getCustomerServiceReport)
    .post(validateCustomerServiceData, customerService.addCustomerServiceData);

router.get('/users/:userid', validateUser, checkQueryParams, 
    calculateDateRange, customerService.getCustomerServiceReportForUser);

router.get('/restaurants/:restaurantid', validateRestaurant, checkQueryParams, 
    calculateDateRange, customerService.getCustomerServiceReportForRestaurant);

router.get('/drivers/:driverid', validateDriver, checkQueryParams, 
    calculateDateRange, customerService.getCustomerServiceReportForDriver);

module.exports = router;