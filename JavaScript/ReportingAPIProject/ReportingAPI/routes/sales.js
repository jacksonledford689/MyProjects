const express = require('express');

const router = express.Router();
const sales = require('../controllers/sales');
const {checkQueryParams, calculateDateRange} = require('../middleware');

router.route('/')
    .get(checkQueryParams, calculateDateRange, sales.getSalesReport);

module.exports = router;