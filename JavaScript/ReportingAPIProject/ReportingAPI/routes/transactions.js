
const express = require('express');

const router = express.Router();


const transactions = require('../controllers/transactions');


const {checkQueryParams, calculateDateRange, validateTransactionsData,
    validateUser, validateRestaurant} = require('../middleware');

router.route('/')
    .get(checkQueryParams, calculateDateRange, transactions.getTransactionReport)
    .post(validateTransactionsData, transactions.addTransactionsData);

router.get('/users/:userid', validateUser, checkQueryParams, 
    calculateDateRange, transactions.getTransactionsReportForUser);

router.get('/restaurants/:restaurantid', validateRestaurant, checkQueryParams, 
    calculateDateRange, transactions.getTransactionsReportForRestaurant);

module.exports = router;