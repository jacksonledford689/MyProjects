const express = require('express');

const router = express.Router();
const restaurants = require('../controllers/restaurants');
const {checkQueryParams, calculateDateRange, validateRestaurant, 
    validateMetricForRestaurants, validateRestaurantsData} = require('../middleware');

router.route('/')
    .get(checkQueryParams, calculateDateRange, restaurants.getRestaurantsReport)
    .post(validateRestaurantsData, restaurants.addRestaurantsData);

router.get('/top', validateMetricForRestaurants, checkQueryParams, 
    calculateDateRange, restaurants.getRestaurantsReportForMetric);

router.get('/:restaurantid', validateRestaurant, checkQueryParams, 
    calculateDateRange, restaurants.getRestaurantsReportForRestaurant);


module.exports = router;