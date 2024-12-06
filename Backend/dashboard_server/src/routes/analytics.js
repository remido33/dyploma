const router = require('express').Router();
const { getAnalyticsController } = require("../controllers/analytics");
const validateParams = require("../../../shared_utils/validateParams");

router.get(
    '/:storeId',
    validateParams([
        {
            key: 'query',
            value: 'startDate',
            type: 'string',
        },
        {
            key: 'query',
            value: 'endDate',
            type: 'string',
        }
    ]),
    getAnalyticsController,
);

module.exports = router;