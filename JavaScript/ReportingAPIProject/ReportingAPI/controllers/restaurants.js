const utils = require('../utils.js');
const restaurantsData = require('../seeds/restaurants.json');

module.exports.getRestaurantsReport = (req, res) => {
    const {startDate, endDate} = req;

    const filteredRestaurantsData = utils.filterByDateRange(startDate, endDate, restaurantsData);

    if (filteredRestaurantsData.length <= 0) {
        return res.status(404).json( {
            status: res.statusCode,
            message: "No Data available at current date range to form report"
        })
    }

    return res.status(200).json(
        {
            startDate,
            endDate,
            ...utils.restaurantsReport(filteredRestaurantsData) 
        }
    );
}

module.exports.getRestaurantsReportForRestaurant = (req, res) => {
    const {startDate, endDate} = req;
    const {restaurantid} = req.params;

    const filteredRestaurantsData = utils.filterByDateRange(startDate, endDate, restaurantsData);

    if (filteredRestaurantsData.length <= 0) {
        return res.status(404).json( {
            status: res.statusCode,
            message: "No Data available at current date range to form report"
        })
    }

    let filterByRestaurant = [];
    filteredRestaurantsData.forEach( e => filterByRestaurant.push(...e.restaurantList));
    filterByRestaurant = filterByRestaurant.filter( rest => rest.restaurantid == restaurantid);
    
    if (filterByRestaurant.length <= 0) {
        return res.status(404).json( {
            code: res.statusCode,
            message: "No Data available for current restaurant at current date range setting"
        })
    }

    filterByRestaurant = [
        {
            restaurantList: filterByRestaurant
        }
    ]

    return res.status(200).json({
        startDate,
        endDate,
        ...utils.restaurantsReport(filterByRestaurant, parseInt(restaurantid))
    })
}


module.exports.getRestaurantsReportForMetric = (req, res) => {
    const {startDate, endDate} = req;
    const {metric} = req.query;

    const filteredRestaurantsData = utils.filterByDateRange(startDate, endDate, restaurantsData);

    if (filteredRestaurantsData.length <= 0) {
        return res.status(404).json( {
            code: res.statusCode,
            message: "No Data available for restaurants at current date range"
        })
    }

    //profit', 'rating', 'numberOfOrders', 'averagePickupTime

    const map = {};

    filteredRestaurantsData.forEach( date => {

        date.restaurantList.forEach( rest => {
            const id = rest.restaurantid;
            map[id] ? map[id] += rest[metric] : map[id] = rest[metric];
        })

    })

    let bestId;
    if (metric == 'averagePickupTime') {
        //increasing
        bestId = Object.keys(map).sort( (a, b) => map[a] - map[b]).at(0);
    } else {
        //decreasing
        bestId = Object.keys(map).sort( (a, b) => map[b] - map[a]).at(0);
    }

    let filterByRestaurant = [];
    filteredRestaurantsData.forEach( e => filterByRestaurant.push(...e.restaurantList));
    filterByRestaurant = filterByRestaurant.filter( rest => rest.restaurantid == bestId);

    if (filterByRestaurant.length <= 0) {
        return res.status(404).json( {
            code: res.statusCode,
            message: "No Data available for current restaurant at current date range setting"
        })
    }

    filterByRestaurant = [
        {
            restaurantList: filterByRestaurant
        }
    ]

    return res.status(200).json({
        startDate,
        endDate,
        ...utils.restaurantsReport(filterByRestaurant, parseInt(bestId))
    })
}

module.exports.addRestaurantsData = (req, res) => {
    restaurantsData.push(...req.body);

    return res.status(200).json({
        status: res.statusCode,
        message: "successfully posted data"
    })
}