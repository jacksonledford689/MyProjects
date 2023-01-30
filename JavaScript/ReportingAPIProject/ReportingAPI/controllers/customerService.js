const utils = require('../utils.js');
const customerServiceData = require('../seeds/customerService.json');

module.exports.getCustomerServiceReport = (req, res) => {
    const {startDate, endDate} = req;

    const filteredCustomerServiceData = utils.filterByDateRange(startDate, endDate, customerServiceData);

    if (filteredCustomerServiceData.length <= 0) {
        return res.status(404).json( {
            status: res.statusCode,
            message: "No Data available at current date range to form report"
        })
    }

    return res.status(200).json(
        {
            startDate,
            endDate,
            ...utils.customerServiceReport(filteredCustomerServiceData)
        }
    );
}

module.exports.getCustomerServiceReportForUser = (req, res) => {
    const {startDate, endDate} = req;
    const {userid} = req.params;

    const filteredCustomerServiceData = utils.filterByDateRange(startDate, endDate, customerServiceData);

    if (filteredCustomerServiceData.length <= 0) {
        return res.status(404).json( {
            status: res.statusCode,
            message: "No Data available at current date range to form report"
        })
    }

    let filterByUser = [];
    filteredCustomerServiceData.forEach(e => filterByUser.push(...e.ticketItems));
    filterByUser = filterByUser.filter( ticket => ticket.userid == userid);

    if(filterByUser.length <= 0) {
        return res.status(404).json( {
            status: res.statusCode,
            message: "No Data available for current user at current date range setting"
        })
    }

    filterByUser = [
        {
            ticketItems: filterByUser
        }
    ]

    return res.status(200).json({
        startDate,
        endDate,
        ...utils.customerServiceReport(filterByUser, parseInt(userid))
    })
}

module.exports.getCustomerServiceReportForRestaurant = (req, res) => {
    const {startDate, endDate} = req;
    const {restaurantid} = req.params;

    const filteredCustomerServiceData = utils.filterByDateRange(startDate, endDate, customerServiceData);

    if (filteredCustomerServiceData.length <= 0) {
        return res.status(404).json( {
            status: res.statusCode,
            message: "No Data available at current date range to form report"
        })
    }

    let filterByRestaurant = [];
    filteredCustomerServiceData.forEach(e => filterByRestaurant.push(...e.ticketItems));
    filterByRestaurant = filterByRestaurant.filter( ticket => ticket.restaurantid == restaurantid);

    if(filterByRestaurant.length <= 0) {
        return res.status(404).json( {
            status: res.statusCode,
            message: "No Data available for current restaurant at current date range setting"
        })
    }

    filterByRestaurant = [
        {
            ticketItems: filterByRestaurant
        }
    ]

    return res.status(200).json({
        startDate,
        endDate,
        ...utils.customerServiceReport(filterByRestaurant, null, parseInt(restaurantid))
    })
}

module.exports.getCustomerServiceReportForDriver = (req, res) => {
    const {startDate, endDate} = req;
    const {driverid} = req.params;

    const filteredCustomerServiceData = utils.filterByDateRange(startDate, endDate, customerServiceData);

    if (filteredCustomerServiceData.length <= 0) {
        return res.status(404).json( {
            status: res.statusCode,
            message: "No Data available at current date range to form report"
        })
    }

    let filterByDriver = [];
    filteredCustomerServiceData.forEach(e => filterByDriver.push(...e.ticketItems));
    filterByDriver = filterByDriver.filter( ticket => ticket.driverid == driverid);


    if(filterByDriver.length <= 0) {
        return res.status(404).json( {
            status: res.statusCode,
            message: "No Data available for current driver at current date range setting"
        })
    }

    filterByDriver = [
        {
            ticketItems: filterByDriver
        }
    ]

    return res.status(200).json({
        startDate,
        endDate,
        ...utils.customerServiceReport(filterByDriver, null, null, parseInt(driverid))
    })
    
}

module.exports.addCustomerServiceData = (req, res) => {
    customerServiceData.push(...req.body);

    return res.status(200).json({
        status: res.statusCode,
        message: "successfully posted data"
    })
}