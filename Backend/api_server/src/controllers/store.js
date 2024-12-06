const tryCatch = require("../../../shared_utils/tryCatch");
const { 
    getProductService,
    createCheckoutService,
    getMultipleProductsService,
    getSearchResultsService,
    getRecommendationService,
    getCollectionProductsService, 
} = require("../services/store");

const getCollectionProductsController = tryCatch(async (req, res) => {
    const { storeId, refId, } = req.params;
    const { offset, limit, sortBy, aggs = '', fields, } = req.query;

    const response = await getCollectionProductsService({
        storeId, 
        refId,
        offset: parseInt(offset, 10) || 0,
        limit: parseInt(limit, 10) || 10,
        sortBy,
        aggs,
        fields,
    });

    res.status(200).json(response);
});

const getProductController = tryCatch(async (req, res) => {
    const { storeId, productId, } = req.params;
    
    const response = await getProductService({ 
        storeId, 
        productId, 
    });

    res.status(200).json(response);
});

const getMultipleProductsController = tryCatch(async (req, res) => {
    const { storeId, } = req.params;
    const { ids, } = req.query;
    const productIds = ids.split(',');

    const response = await getMultipleProductsService({ storeId, productIds });
    res.status(200).json(response);
});

const createCheckoutController = tryCatch(async (req, res) => {
    const { storeId, } = req.params;
    const { items, } = req.body;

    const isValid = items.every(item => {
        const keys = Object.keys(item);
        return keys.length === 2
            && keys.includes('variantId')
            && keys.includes('quantity')
    });

    if (!isValid) {
        throw getError(400, 'Each item must contain exactly the keys "id" and "quantity".');
    };

    const response = await createCheckoutService({ storeId, items, });

    res.status(200).json(response)
})

const getSearchResultsController = tryCatch(async (req, res) => {
    const { storeId, } = req.params;
    const { query, offset, limit, sortBy, aggs = '', fields, } = req.query;

    const response = await getSearchResultsService({
        storeId, 
        query,
        offset,
        limit, 
        sortBy,
        aggs,
        fields,
    });

    res.status(200).json(response);
});

const getRecommendationController = tryCatch(async (req, res) => {
    const { storeId, } = req.params;
    const { ids, fields, } = req.query;
    const productIds = ids.split(',');

    const response = await getRecommendationService({ storeId, productIds, fields, });
    res.status(200).json(response);
});

module.exports = {
    getProductController,
    getMultipleProductsController,
    getSearchResultsController,
    getCollectionProductsController,
    getRecommendationController,
    createCheckoutController,
};
