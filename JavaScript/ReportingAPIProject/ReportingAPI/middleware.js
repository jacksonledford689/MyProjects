const utils = require('./utils.js')
const schemas = require('./schemas.js');

//middleware to validate query params
module.exports.checkQueryParams = (req, res, next) => {
    const {startdate, enddate, timeframe} = req.query;
    const timeframeOptions = ['day', 'week', 'month', 'year'];

    if (startdate && enddate && timeframe) {
        return res.status(400).json(
            {
                status: res.statusCode,
                message: "Query parameters not formatted correctly"
            }
        )
    } 
    if (timeframe && timeframeOptions.indexOf(timeframe) === -1) {
        return res.status(400).json(
            {
                status: res.statusCode,
                message: "Timeframe value is not valid"
            }
        )
    } 
    if  (startdate && enddate && new Date(startdate).getTime() > new Date(enddate).getTime()) {
        return res.status(400).json(
            {
                status: res.statusCode,
                message: "startdate cannot be less than enddate"
            }
        )
    }
    if (startdate && new Date(startdate).getTime() > new Date().getTime()) {
        return res.status(400).json(
            {
                status: res.statusCode,
                message: "startdate cannot be greater than current date"
            }
        )
    }

    return next();
}


//middleware to get the date range for report
module.exports.calculateDateRange = (req, res, next) => {
    const {startdate, enddate, timeframe} = req.query;

    const currentDate = new Date().toISOString().split('T')[0];

    const beginningDate = '2010-01-01'
    let start = startdate || beginningDate;
    let end = enddate || currentDate;

    if (new Date(end).getTime() > new Date().getTime()) {
        end = currentDate;
    }

    if (timeframe) {
        if (enddate) {
            start = utils.getTimeframeStartDate(end, timeframe);
        } else if(startdate) {
            end = utils.getTimeframeEndDate(start, timeframe);
            if (new Date(end).getTime() > new Date().getTime()) {
                end = currentDate;
            }
        }  
        else {
            start = utils.getTimeframeStartDate(currentDate, timeframe);
            end = currentDate;
        }
    }

    req.startDate = start;
    req.endDate = end;

    return next();

}

module.exports.validateDriversData = (req, res, next) => {
    const data = req.body;
    const schema = schemas.driversSchema;

    const result = schema.validate(data);
    if (result.error) {
        return res.status(400).json( {
            status: res.statusCode,
            message: result.error.details[0].message
        })
    }

    let goNext = true;

    data.forEach( driver => {
        if (!utils.isValidDriverId(driver.driverid)) {
            goNext = false;
            return res.status(404).json({
                status: res.statusCode,
                message: "Data contains invalid driver id"
            });
        }

        driver.deliveries.forEach( delivery => {
            if (!utils.isValidRestaurantId(delivery.restaurantid)) {
                goNext = false;
                return res.status(404).json({
                    status: res.statusCode,
                    message: "Data contains invalid restaurantid"
                });
            }
        })
    })

    if (goNext) return next();
}

module.exports.validateAbandonedCartsData = (req, res, next) => {

    const data = req.body;

    const schema = schemas.AbandonedCartsSchema;

    const result = schema.validate(data);
    if (result.error) {
        return res.status(400).json( {
            status: res.statusCode,
            message: result.error.details[0].message
        })
    }
    
    let goNext = true;

    data.forEach( cart => {
        //check for invalid restaurant id
        if (!utils.isValidRestaurantId(cart.restaurantid)) {
            goNext = false;
            return res.status(404).json({
                status: res.statusCode,
                message: "Data contains invalid restaurant id"
            });
        }

        //check for invalid user id
        if (!utils.isValidUserId(cart.userid)) {
            goNext = false;
            return res.status(404).json({
                status: res.statusCode,
                message: "Data contains invalid user id"
            });
        }

        //check for invalid item id
        cart.cartItems.forEach( item => {
            if (!utils.isValidItemId(item.itemid)) {
                goNext = false;
                return res.status(404).json({
                    status: res.statusCode,
                    message: "Data contains invalid item id"
                });
            }
        })

    })

    if (goNext) return next();
};

//middleware for validating user id
module.exports.validateUser = (req, res, next) => {
    const {userid} = req.params;

    //hard code because don't have access to user database
    if (userid < 1 || userid > 1000) {
        return res.status(404).json( {
            status: res.statusCode,
            message: "User not found"
        })
    }
    return next();
}

//middleware for validating restaurant id
module.exports.validateRestaurant = (req, res, next) => {
    const {restaurantid} = req.params;
    if (restaurantid < 1 || restaurantid > 200) {
        return res.status(404).json( {
            status: res.statusCode,
            message: "Restaurant not found"
        })
    }
    return next();
} 

//middleware for validating driver id
module.exports.validateDriver = (req, res, next) => {
    const {driverid} = req.params;
    if (driverid < 1 || driverid > 200) {
        return res.status(404).json( {
            status: res.statusCode,
            message: "Driver not found"
        })
    }
    return next();
}

//middleware for validating metric for restaurants
module.exports.validateMetricForRestaurants = (req, res, next) => {
    const {metric} = req.query;
    if (!metric) {
        return res.status(400).json( {
            status: res.statusCode,
            message: "Must include a metric request query"
        })
    }
    const options = ['profit', 'rating', 'numberOfOrders', 'averagePickupTime']
    if(!options.includes(metric))
    {
        return res.status(404).json( {
            status: res.statusCode,
            message: "Metric not found"
        })
    }
    return next();
}

module.exports.validateMetricForDrivers = (req, res, next) => {
    const {metric} = req.query;

    if (!metric) {
        return res.status(400).json( {
            status: res.statusCode,
            message: "Must include a metric request query"
        })
    }

    const options = ['isCompleted', 'tipAmount', 'rating', 'deliveryTime'];

    if(!options.includes(metric)) {
        return res.status(404).json( {
            status: res.statusCode,
            message: "Metric not found"
        })
    }

    return next();
}



//middleware for validating reward points
module.exports.validateRewardsData = (req, res, next) => {
    const data = req.body;

    const schema = schemas.rewardsSchema;

    const result = schema.validate(data);
    if (result.error) {
        return res.status(400).json( {
            status: res.statusCode,
            message: result.error.details[0].message
        })
    }

    let goNext = true;
    
    data.forEach( rewards => {

        rewards.rewardList.forEach( user => {

            if (!utils.isValidUserId(user.userid)) {
                goNext = false;
                return res.status(404).json({
                    status: res.statusCode,
                    message: "Data contains invalid user id"
                });
            }
            if (!utils.isValidRewardPoints(user.rewardPoints)) {
                goNext = false;
                return res.status(404).json({
                    status: res.statusCode,
                    message: "Data contains invalid reward point data"
                });
            }

        })
    })

    if (goNext) return next();
}


module.exports.validateTransactionsData = (req, res, next) => {

    const data = req.body;

    const schema = schemas.transactionsSchema;

    const result = schema.validate(data);
    if (result.error) {
        return res.status(400).json( {
            status: res.statusCode,
            message: result.error.details[0].message
        })
    }
    
    let goNext = true;

    data.forEach( transactions => {
        //check for invalid restaurant id
        if (!utils.isValidRestaurantId(transactions.restaurantid)) {
            goNext = false;
            return res.status(404).json({
                status: res.statusCode,
                message: "Data contains invalid restaurant id"
            });
        }

        //check for invalid user id
        transactions.transactionItems.forEach( transaction => {
            if (!utils.isValidUserId(transaction.userid)) {
                goNext = false;
                return res.status(404).json({
                    status: res.statusCode,
                    message: "Data contains invalid user id"
                });
            }
        })
    })

    if (goNext) return next();
};

module.exports.validateCustomerServiceData = (req, res, next) => {
    const data = req.body;
    const schema = schemas.customerServiceSchema;

    const result = schema.validate(data);
    if (result.error) {
        return res.status(400).json( {
            status: res.statusCode,
            message: result.error.details[0].message
        })
    }

    let goNext = true;
    

    data.forEach( date => {
        date.ticketItems.forEach(ticket => {

            if (!utils.isValidRestaurantId(ticket.restaurantid)) {
                goNext = false;
                return res.status(404).json({
                    status: res.statusCode,
                    message: "Data contains invalid restaurant id"
                });
            }

            if (!utils.isValidUserId(ticket.userid)) {
                goNext = false;
                return res.status(404).json({
                    status: res.statusCode,
                    message: "Data contains invalid user id"
                });
            }

            if (!utils.isValidDriverId(ticket.driverid)) {
                goNext = false;
                return res.status(404).json({
                    status: res.statusCode,
                    message: "Data contains invalid driver id"
                })
            }

        })
    })

    if (goNext) return next();
}

module.exports.validateRestaurantsData = (req, res, next) => {
    const data = req.body;
    const schema = schemas.restaurantsSchema;

    const result = schema.validate(data);
    if (result.error) {
        return res.status(400).json( {
            status: res.statusCode,
            message: result.error.details[0].message
        })
    }

    let goNext = true;

    data.forEach( date => {
        date.restaurantList.forEach( rest => {
            if (!utils.isValidRestaurantId(rest.restaurantid)) {
                goNext = false;
                return res.status(404).json({
                    status: res.statusCode,
                    message: "Data contains invalid restaurant id"
                });
            }
        })
    })

    if (goNext) return next();
}