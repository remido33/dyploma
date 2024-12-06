const pool = require('../helpers/db');
const getError = require('../../../shared_utils/getError');
const elastic = require('../../../shared_utils/elastic');
const executeQueryWithoutPool = require('../helpers/executeQueryWithoutPool');
const { deleteCollectionSets, saveCollections } = require('../helpers/service_helpers/collectionsHelpers'); 
const { 
    checkStoreExistsById, 
    updateStoreApiKey, 
    updateStoreFilters, 
    updateStoreCollections, 
    updateStoreFields, 
    setElasticProducts,
    parseProduct, 
} = require('../helpers/service_helpers');
const { 
    setRedisHash, 
    getRedisHash, 
    deleteRedisHash, 
    deleteKeysByPattern,
    updateRedisHash,
} = require('../../../shared_utils/redisHelpers');
const { 
    encrypt,
    decrypt,
} = require('../../../shared_utils/encrypt');

const createStoreService = async ({ storeName, accountName, planId, apiKey, accessToken }) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const fields = '["mainImage","title","minPrice"]';

        const encryptedApiKey = encrypt(apiKey);
        const encryptedAccessToken = encrypt(accessToken)
        const query = 'INSERT INTO stores (store_name, account_name, current_plan_id, api_key, filters, collections, fields, access_token) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id';
        const params = [storeName, accountName, planId, encryptedApiKey, '[]', '[]', fields, encryptedAccessToken];
        
        const result = await executeQueryWithoutPool({ client, query, params });
        const storeId = result.rows[0].id;

        await setElasticProducts({ 
            storeId, 
            apiKey, 
            storeName 
        });

        await setRedisHash(`store:${storeId}`, { 
            apiKey: encryptedApiKey,
            accessToken: encryptedAccessToken,
            storeName: storeName,
            accountName: accountName,
            filters: '[]',
            collections: '[]',
            fields: fields,
        });
        
        await client.query('COMMIT');

        return { id: storeId, };
    } catch (error) {
        await client.query('ROLLBACK');
        console.log(error);
        throw getError(500, 'Error creating store.');
    } finally {
        client.release();
    }
};

const getStoreService = async ({ id }) => {
    const { filters, collections, fields, } = await getRedisHash(`store:${id}`, ['filters', 'collections', 'fields']);

    const response = {
        filters: JSON.parse(filters),
        collections: JSON.parse(collections),
        fields: JSON.parse(fields)
    };

    return response;
};

const updateStoreService = async ({ id, updates }) => {

    for (const { key, value } of updates) {
        switch (key) {
            case 'apiKey':
                await updateStoreApiKey({ id, apiKey: value });
                return { message: `Api key updated for ${id}`}

            case 'filters':
                const updatedFilters = await updateStoreFilters({ 
                    id, 
                    filters: value,
                });

                return { 
                    filters: updatedFilters,
                };

            case 'fields': 
                const updatedFields = await updateStoreFields({
                    id, 
                    fields: value,
                });

                return {
                    fields: updatedFields,
                }
            
            case 'collections':

                const updatedCollections = await updateStoreCollections({ 
                    id, 
                    collections: value,
                });

                return { 
                    collections: updatedCollections,
                };

            default:
                throw getError(500, `Unhandled key: ${key}`);
        }
    }
};

const deleteStoreService = async ({ id }) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Ensure the store exists
        await checkStoreExistsById(client, id);

        // Step 1: Delete related data
        await executeQueryWithoutPool({
            client,
            query: 'DELETE FROM user_store_access WHERE store_id = $1',
            params: [id],
        });

        await executeQueryWithoutPool({
            client,
            query: 'DELETE FROM terms WHERE store_id = $1',
            params: [id],
        });

        await executeQueryWithoutPool({
            client,
            query: 'DELETE FROM analytics WHERE store_id = $1',
            params: [id],
        });

        // Step 2: Select all purchase IDs for the store
        const purchases = await executeQueryWithoutPool({
            client,
            query: 'SELECT id FROM purchases WHERE store_id = $1',
            params: [id],
        });

        const purchaseIds = purchases.rows.map((row) => row.id);

        if (purchaseIds.length > 0) {
            // Step 3: Delete purchase_products for all purchase IDs
            await executeQueryWithoutPool({
                client,
                query: 'DELETE FROM purchase_products WHERE purchase_id = ANY($1::uuid[])',
                params: [purchaseIds],
            });
        }

        // Step 4: Delete purchases for the store
        await executeQueryWithoutPool({
            client,
            query: 'DELETE FROM purchases WHERE store_id = $1',
            params: [id],
        });

        // Step 5: Delete the store itself
        await executeQueryWithoutPool({
            client,
            query: 'DELETE FROM stores WHERE id = $1',
            params: [id],
        });

        // Step 6: Delete Elasticsearch index and Redis keys
        await elastic.indices.delete({ index: `${id}_products` });
        await deleteRedisHash(`store:${id}`);
        await deleteKeysByPattern(`store:${id}:collections`);

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error deleting store:', error);
        throw getError(500, 'Error deleting store.');
    } finally {
        client.release();
    }
};
const createProductWebhookService = async ({ storeId, data }) => {
    const product = parseProduct(data);

    await elastic.index({
        index: `${storeId}_products`,
        id: product.id,
        body: {
            ...product,
            collections: [],
        },
    });

}

const updateProductWebhookService = async ({ storeId, data }) => {
    const product = parseProduct(data);
    
    await elastic.update({
        index: `${storeId}_products`,
        id: product.id,
        body: {
            doc: product,
            doc_as_upsert: true,
        }
    });
};

const deleteProductWebhookService = async ({ storeId, deleteId }) => {
    await elastic.delete({
        index: `${storeId}_products`,
        id: deleteId,
    });
}

const updateCollectionWebhookService = async ({ storeId, updateId }) => {

    const { storeName, apiKey, collections } = await getRedisHash(`store:${storeId}`, ['storeName', 'apiKey', 'collections']);

    const existingCollections = JSON.parse(collections);

    const found = existingCollections.some((collection) => 
        collection.ref === deleteId || 
        collection?.nested?.some((nested) => nested.ref === deleteId)
    );

    if(found) {
        await saveCollections({
            pushCollections: [updateId],
            storeId,
            storeName,
            apiKey: decrypt(apiKey),
        });
    }
}

const deleteCollectionWebhookService = async ({ storeId, deleteId }) => {
    const { collections } = await getRedisHash(
        `store:${storeId}`, 
        ['collections']
    );
    const existingCollections = JSON.parse(collections);

    const found = existingCollections.some((collection) => 
        collection.ref === deleteId || 
        collection?.nested?.some((nested) => nested.ref === deleteId)
    );

    if(found) {

        const client = await pool.connect();

        const collectionsToSet = existingCollections.map(collection => {
            if(collection.ref !== deleteId) {
                return {
                    ...collection,
                }
            }
            else if(collection?.nested?.find((nested) => nested.ref === deleteId)) {
                return {
                    ...collection,
                    nested: collection.nested.filter(({ ref }) => ref !== deleteId),
                }
            }
        }).filter(Boolean);

        const jsonCollections = JSON.stringify(collectionsToSet);

        try {

            await deleteCollectionSets({
                deleteCollections: [deleteId],
                storeId,
            });
    
            await executeQueryWithoutPool({
                client,
                query: 'UPDATE stores SET collections = $1 WHERE id = $2',
                params: [jsonCollections, storeId],
            });
    
            await updateRedisHash(`store:${storeId}`, [{ key: 'collections', value: jsonCollections }]);
        }
        catch (error) {
            await client.query('ROLLBACK');
            console.log(error);
            /* alert! webhook did not work! */
        } finally {
            client.release();
        }
        
    }
};

module.exports = {
    createStoreService,
    getStoreService,
    updateStoreService,
    deleteStoreService,
    createProductWebhookService,
    updateProductWebhookService,
    deleteProductWebhookService,
    updateCollectionWebhookService,
    deleteCollectionWebhookService,
};
