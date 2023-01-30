
const express = require('express');

const router = express.Router();
const drivers = require('../controllers/drivers');
const {checkQueryParams, calculateDateRange, validateDriver, 
    validateMetricForDrivers, validateDriversData} = require('../middleware');

router.route('/')
    .get(checkQueryParams, calculateDateRange, drivers.getDriversReport)
    .post(validateDriversData, drivers.addDriversData);

router.get('/top', validateMetricForDrivers, checkQueryParams, 
    calculateDateRange, drivers.getDriversReportByMetric);

router.get('/:driverid', validateDriver, checkQueryParams, 
    calculateDateRange, drivers.getDriversReportForDriver);


module.exports = router;