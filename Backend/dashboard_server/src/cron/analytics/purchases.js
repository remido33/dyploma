const cron = require('node-cron');
const { getRedisHash, deleteRedisHash, getAllRedisKeys } = require('../../../../shared_utils/redisHelpers');
const executeQuery = require('../../helpers/executeQuery');
const { v4: uuidv4 } = require('uuid');

const transferTermsToDb = async () => {
    try {
        const keys = await getAllRedisKeys('purchase*');
        if (keys.length === 0) return;

        let purchaseData = [];
        let purchaseProductsData = [];
        
        for (const key of keys) {
            const uniqueId = uuidv4();
            const { storeId, productIds, platformId, timestamp } = await getRedisHash(key);
            const date = new Date(parseInt(timestamp, 10));
            const actionTime = date.toISOString();

            purchaseData.push([uniqueId, storeId, actionTime]);
            
            const formattedIds = productIds.split(',').map((id) => parseInt(id));
            for (const productId of formattedIds) {
                purchaseProductsData.push([uniqueId, productId]);
            }
        }

        if (purchaseData.length > 0) {

            const purchasesQuery = `
                INSERT INTO purchases
                (id, store_id, timestamp) 
                VALUES ${purchaseData.map((_, i) => 
                    `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`).join(', ')}
            `;

            await executeQuery(purchasesQuery, purchaseData.flat());

            const purchaseProductsQuery = `
                INSERT INTO purchase_products
                (purchase_id, product_id)
                VALUES ${purchaseProductsData.map((_, i) => 
                    `($${i * 2 + 1}, $${i * 2 + 2})`).join(', ')}
            `;
             await executeQuery(purchaseProductsQuery, purchaseProductsData.flat());
        }
    
        for (const key of keys) {
            await deleteRedisHash(key);
        }

    } catch (error) {
        console.error('Error transferring data to the database:', error);
    }
};


cron.schedule('*/10 * * * * *', async () => {
    try {
        await transferTermsToDb();
    } catch (error) {
        console.error('Error in scheduled task:', error);
    }
});
