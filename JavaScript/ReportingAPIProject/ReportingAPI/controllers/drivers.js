const utils = require('../utils.js');
const driversData = require('../seeds/drivers.json');

module.exports.getDriversReport = (req, res) => {
    const {startDate, endDate} = req;

    const filteredDriversData = utils.filterByDateRange(startDate, endDate, driversData);

    if (filteredDriversData.length <= 0) {
        return res.status(404).json( {
            status: res.statusCode,
            message: "No Data available at current date range to form report"
        })
    }

    return res.status(200).json(
        {
            startDate,
            endDate,
            ...utils.driversReport(filteredDriversData) 
        }
    );
}

module.exports.getDriversReportForDriver = (req, res) => {
    const {startDate, endDate} = req;
    const {driverid} = req.params;

    const filteredDriversData = utils.filterByDateRange(startDate, endDate, driversData);

    if (filteredDriversData.length <= 0) {
        return res.status(404).json( {
            status: res.statusCode,
            message: "No Data available at current date range to form report"
        })
    }

    const filterByDriver = filteredDriversData.filter( driver => driver.driverid == driverid);

    if (filterByDriver.length <= 0) {
        return res.status(404).json( {
            code: res.statusCode,
            message: "No Data available for current driver at current date range setting"
        })
    }

    return res.status(200).json({
        startDate,
        endDate,
        ...utils.driversReport(filterByDriver, parseInt(driverid)) 
    })
}

module.exports.getDriversReportByMetric = (req, res) => {
    const {startDate, endDate} = req;
    const {metric} = req.query;

    const filteredDriversData = utils.filterByDateRange(startDate, endDate, driversData);

    if (filteredDriversData.length <= 0) {
        return res.status(404).json( {
            status: res.statusCode,
            message: "No Data available at current date range to form report"
        })
    }

    const map = {};

    filteredDriversData.forEach( driver => {
        const id = driver.driverid;

        driver.deliveries.forEach( delivery => {
            map[id] ? map[id] += delivery[metric] : map[id] = delivery[metric];
        })
    })

    let bestId;
    if (metric == 'deliveryTime') {
        //increasing
        bestId = Object.keys(map).sort( (a, b) => map[a] - map[b]).at(0);
    } else {
        //decreasing
        bestId = Object.keys(map).sort( (a, b) => map[b] - map[a]).at(0);
    }

    const filterByDriver = filteredDriversData.filter( delivery => delivery.driverid == bestId);

    return res.status(200).json({
        startDate,
        endDate,
        ...utils.driversReport(filterByDriver, parseInt(bestId)) 
    })

}

module.exports.addDriversData = (req, res) => {
    driversData.push(...req.body);

    return res.status(200).json({
        status: res.statusCode,
        message: "successfully posted data"
    })
}