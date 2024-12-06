const { 
    getAnalyticsService,
} = require("../services/analytics");
const tryCatch = require("../../../shared_utils/tryCatch");

const getAnalyticsController = tryCatch(async (req, res) => {
    const { storeId, } = req.params;
    const { startDate, endDate, } = req.query;
    const response = await getAnalyticsService({ storeId, startDate, endDate, });

    res.status(200).json(response);
});

module.exports = {
    getAnalyticsController,
};
