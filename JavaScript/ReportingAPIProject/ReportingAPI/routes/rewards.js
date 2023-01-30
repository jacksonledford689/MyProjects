
const express = require('express');

const router = express.Router();
const rewards = require('../controllers/rewards');
const {calculateDateRange, validateRewardsData, checkQueryParams,
    validateUser} = require('../middleware');

router.post('/', validateRewardsData, rewards.addRewardData);

router.get('/users/:userid', validateUser, checkQueryParams,
    calculateDateRange, rewards.getRewardsReportForUser);


module.exports = router;