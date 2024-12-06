const router = require('express').Router();
const validateParams = require("../../../shared_utils/validateParams");
const { 
    getCollectionProductsController,
    getProductController,
    getMultipleProductsController,
    createCheckoutController,
    getSearchResultsController,
    getRecommendationController,
} = require("../controllers/store");
const { isStringOfNumbersSeparatedByComma } = require('../../../shared_utils/validators');

router.get(
    '/:storeId/products/search',
    validateParams([
        { 
            key: 'query', 
            value: 'query', 
            type: 'string',
        },
        { 
            key: 'query', 
            value: 'offset', 
            type: 'number',
        },
        { 
            key: 'query', 
            value: 'limit', 
            type: 'number',
        },
        {
            key: 'query',
            value: 'fields',
            type: 'string',
        },
    ]),
    getSearchResultsController,
);

router.get(
    '/:storeId/products/:productId',
    getProductController,
);

router.get(
    '/:storeId/products',
    validateParams([
        {
            key: 'query',
            value: 'ids',
            validate: (ids) => isStringOfNumbersSeparatedByComma(ids)
        },
    ]),
    getMultipleProductsController,
);

router.get(
    '/:storeId/recommendation',
    validateParams([
        {
            key: 'query',
            value: 'ids',
            validate: (ids) => isStringOfNumbersSeparatedByComma(ids)
        },
        
    ]),
    getRecommendationController,
);

router.post(
    '/:storeId/checkout',
    validateParams([
        {
            key: 'body',
            value: 'items',
            validate: (value) => Array.isArray(value),
        }
    ]),
    createCheckoutController,
);

router.get(
    '/:storeId/collections/:refId/products',
    validateParams([
        { 
            key: 'query', 
            value: 'offset', 
            type: 'number',
        },
        {
            key: 'query', 
            value: 'limit', 
            type: 'number',
        },
        {
            key: 'query',
            value: 'fields',
            type: 'string',
        },
    ]),
    getCollectionProductsController,
);

module.exports = router;