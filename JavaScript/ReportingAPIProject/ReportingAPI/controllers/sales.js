const utils = require('../utils.js');

const salesData = require('../seeds/sales.json');
 
module.exports.getSalesReport = (req, res) => {
    const {startDate, endDate} = req;

    const filteredSalesData = utils.filterByDateRange(startDate, endDate, salesData);

    if (filteredSalesData.length <= 0) {
        return res.status(404).json( {
            status: res.statusCode,
            message: "No Data available at current date range to form report"
        })
    }

    return res.status(200).json(
        {
            startDate,
            endDate,
            ...utils.salesReport(filteredSalesData)
        }
    );
}