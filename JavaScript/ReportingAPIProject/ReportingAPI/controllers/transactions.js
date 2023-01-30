const utils = require('../utils.js');

const transactionsData = require('../seeds/transactions.json');


module.exports.getTransactionReport = (req, res) => {
    const {startDate, endDate} = req;

    const filteredTransactionsData = utils.filterByDateRange(startDate, endDate, transactionsData);

    if (filteredTransactionsData.length <= 0) {
        return res.status(404).json( {
            status: res.statusCode,
            message: "No Data available at current date range to form report"
        })
    }

    return res.status(200).json(
        {
            startDate,
            endDate,
            ...utils.transactionsReport(filteredTransactionsData)
        }
    );
}

module.exports.getTransactionsReportForUser = (req, res) => {
    const {startDate, endDate} = req;
    const {userid} = req.params;

    const filteredTransactionsData = utils.filterByDateRange(startDate, endDate, transactionsData);

    if (filteredTransactionsData.length <= 0) {
        return res.status(404).json( {
            status: res.statusCode,
            message: "No Data available at current date range to form report"
        })
    }

    let filterByUser = [];
    filteredTransactionsData.forEach( e => filterByUser.push(...e.transactionItems))
    filterByUser = filterByUser.filter( transaction => transaction.userid == userid);
    
    if (filterByUser.length <= 0) {
        return res.status(404).json( {
            code: res.statusCode,
            message: "No Data available for current user at current date range setting"
        })
    }

    filterByUser = [
        {
            transactionItems: filterByUser
        }
    ]

    return res.status(200).json({
        startDate,
        endDate,
        ...utils.transactionsReport(filterByUser, parseInt(userid))
    })
}

module.exports.getTransactionsReportForRestaurant = (req, res) => {
    const {startDate, endDate} = req;
    const {restaurantid} = req.params;

    const filteredTransactionsData = utils.filterByDateRange(startDate, endDate, transactionsData);
    if (filteredTransactionsData.length <= 0) {
        return res.status(404).json( {
            status: res.statusCode,
            message: "No Data available at current date range to form report"
        })
    }
    
    const filterByRestaurant = filteredTransactionsData.filter( transactions => transactions.restaurantid == restaurantid);

    if (filterByRestaurant.length <= 0) {
        return res.status(404).json( {
            status: res.statusCode,
            message: "No Data available for current restaurant at current date range setting"
        })
    }

    return res.status(200).json({
        startDate,
        endDate,
        ...utils.transactionsReport(filterByRestaurant, null, parseInt(restaurantid))
    })
}

module.exports.addTransactionsData = (req, res) => {
    transactionsData.push(...req.body);

    return res.status(200).json({
        status: res.statusCode,
        message: "successfully posted data"
    })
}
