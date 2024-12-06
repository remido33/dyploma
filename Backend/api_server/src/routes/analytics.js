const router = require('express').Router();
const validateParams = require("../../../shared_utils/validateParams");
const { 
    createActionAnalyticController, 
    createTermAnalyticController,
    createPurchaseAnalyticController
} = require('../controllers/analytics');


const platforms = [1, 2, 3, 4, 5];
const actions = [1, 2];

router.post(
    '/:storeId/action',
    validateParams([
        { 
            key: 'body', 
            value: 'actionId', 
            validate: (actionId) => actions.find((i) => i === actionId), 
        },
        {
            key: 'body', 
            value: 'productId', 
            validate: 'number', 
        },
        {
            key: 'body', 
            value: 'platformId',
            validate: (platformId) => platforms.find((i) => i === platformId),
        },
    ]), 
    createActionAnalyticController,
);

router.post(
    '/:storeId/term',
    validateParams([
        { 
            key: 'body', 
            value: 'query', 
            validate: 'string', 
        },
        {
            key: 'body', 
            value: 'platformId',
            validate: (platformId) => platforms.find((i) => i === platformId),
        },
    ]), 
    createTermAnalyticController,
);

router.post(
    '/:storeId/purchase',
    validateParams([
        { 
            key: 'body', 
            value: 'productIds', 
            validate: (arr) => Array.isArray(arr) && arr.every(item => typeof item === 'number'), 
        },
        {
            key: 'body', 
            value: 'platformId',
            validate: (platformId) => platforms.find((i) => i === platformId),
        },
    ]), 
    createPurchaseAnalyticController,
);

module.exports = router;