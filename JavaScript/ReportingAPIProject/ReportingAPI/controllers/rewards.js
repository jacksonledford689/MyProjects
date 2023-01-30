const utils = require('../utils.js');
const rewardsData = require('../seeds/rewards.json');
 
module.exports.getRewardsReportForUser = (req, res) => {
    const {startDate, endDate} = req;
    const {userid} = req.params;

    const filteredRewardsData = utils.filterByDateRange(startDate, endDate, rewardsData);

    if (filteredRewardsData.length <= 0) {
        return res.status(404).json( {
            status: res.statusCode,
            message: "No Data available at current date range to form report"
        })
    }

    return res.status(200).json(
        {
            startDate,
            endDate,
            ...utils.rewardsReport(filteredRewardsData, parseInt(userid))
        }
    );
}

module.exports.addRewardData = (req, res) => {
    rewardsData.push(...req.body);

    return res.status(200).json({
        status: res.statusCode,
        message: "successfully posted data"
    })
}

