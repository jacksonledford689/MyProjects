
const express = require('express');

const router = express.Router();
const abandonedCarts = require('../controllers/abandonedCarts');
const {checkQueryParams, calculateDateRange, validateAbandonedCartsData,
    validateUser, validateRestaurant} = require('../middleware');

router.route('/')
    .get(checkQueryParams, calculateDateRange, abandonedCarts.getAbandonedCartsReport)
    .post(validateAbandonedCartsData, abandonedCarts.addAbandonedCartsData);

router.get('/users/:userid', validateUser, checkQueryParams, 
    calculateDateRange, abandonedCarts.getAbandonedCartsReportForUser);

router.get('/restaurants/:restaurantid', validateRestaurant, checkQueryParams, 
    calculateDateRange, abandonedCarts.getAbandonedCartsReportForRestaurant);

module.exports = router;