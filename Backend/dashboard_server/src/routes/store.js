const router = require('express').Router();
const { 
    createStoreController, 
    getStoreController,
    updateStoreController,
    deleteStoreController,
    createProductWebhookController,
    updateProductWebhookController,
    deleteProductWebhookController,
    deleteCollectionWebhookController,
    updateCollectionWebhookController
} = require("../controllers/store");
const validateParams = require("../../../shared_utils/validateParams");
const { plans } = require('../helpers/extraData');
const verifyShopifyRequest = require('../helpers/verifyShopifyRequest');

router.post(
    '/',
    validateParams([
        { 
            key: 'body', 
            value: 'storeName', 
            type: 'string', 
        },
        { 
            key: 'body', 
            value: 'accountName', 
            type: 'string', 
        },
        {
            key: 'body', 
            value: 'planId', 
            validate: (planId) => plans.find(({ id }) => id === planId), 
        },
        {
            key: 'body',
            value: 'apiKey',
            type: 'string',
        },
        {
            key: 'body',
            value: 'accessToken',
            type: 'string',
        }
    ]), 
    createStoreController,
);

router.get(
    '/:id',
    getStoreController,
);

router.delete(
    '/:id',
    deleteStoreController,
);

router.patch(
    '/:id',
    updateStoreController,
);

router.post(
    '/:id/webhook/product/create',
    createProductWebhookController,
);

router.post(
    '/:id/webhook/product/update',
    updateProductWebhookController,
);

router.post(
    '/:id/webhook/product/delete',
    deleteProductWebhookController,
);

router.post(
    '/:id/webhook/collection/update',
    updateCollectionWebhookController,
);

router.post(
    '/:id/webhook/collection/delete',
    deleteCollectionWebhookController
);
    
module.exports = router;