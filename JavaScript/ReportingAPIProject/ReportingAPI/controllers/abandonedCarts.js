const utils = require('../utils.js');
const abandonedCartsData = require('../seeds/abandonedCarts.json');

module.exports.getAbandonedCartsReport = (req, res) => {
    const {startDate, endDate} = req;

    const filteredAbandonedCartsData = utils.filterByDateRange(startDate, endDate, abandonedCartsData);

    if (filteredAbandonedCartsData.length <= 0) {
        return res.status(404).json( {
            status: res.statusCode,
            message: "No Data available at current date range to form report"
        })
    }

    return res.status(200).json(
        {
            startDate,
            endDate,
            ...utils.abandonedCartReport(filteredAbandonedCartsData) 
        }
    );
}

module.exports.getAbandonedCartsReportForUser = (req, res) => {
    const {startDate, endDate} = req;
    const {userid} = req.params;

    const filteredAbandonedCartsData = utils.filterByDateRange(startDate, endDate, abandonedCartsData);

    if (filteredAbandonedCartsData.length <= 0) {
        return res.status(404).json( {
            status: res.statusCode,
            message: "No Data available at current date range to form report"
        })
    }

    const filterByUser = filteredAbandonedCartsData.filter( cart => cart.userid == userid);
    if (filterByUser.length <= 0) {
        return res.status(404).json( {
            code: res.statusCode,
            message: "No Data available for current user at current date range setting"
        })
    }

    return res.status(200).json({
        startDate,
        endDate,
        ...utils.abandonedCartReport(filterByUser, parseInt(userid))
    })
}

module.exports.getAbandonedCartsReportForRestaurant = (req, res) => {
    const {startDate, endDate} = req;
    const {restaurantid} = req.params;

    const filteredAbandonedCartsData = utils.filterByDateRange(startDate, endDate, abandonedCartsData);

    if (filteredAbandonedCartsData.length <= 0) {
        return res.status(404).json( {
            status: res.statusCode,
            message: "No Data available at current date range to form report"
        })
    }

    const filterByRestaurant = filteredAbandonedCartsData.filter( cart => cart.restaurantid == restaurantid);

    if (filterByRestaurant.length <= 0) {
        return res.status(404).json( {
            status: res.statusCode,
            message: "No Data available for current restaurant at current date range setting"
        })
    }

    return res.status(200).json({
        startDate,
        endDate,
        ...utils.abandonedCartReport(filterByRestaurant, null, parseInt(restaurantid))
    })
}

module.exports.addAbandonedCartsData = (req, res) => {
    abandonedCartsData.push(...req.body);

    return res.status(200).json({
        status: res.statusCode,
        message: "successfully posted data"
    })
}