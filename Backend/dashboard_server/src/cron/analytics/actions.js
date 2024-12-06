const cron = require('node-cron');
const { getRedisHash, deleteRedisHash, getAllRedisKeys } = require('../../../../shared_utils/redisHelpers');
const executeQuery = require('../../helpers/executeQuery');

const transferAnalyticsToDB = async () => {
    try {
        const keys = await getAllRedisKeys('analytics*');
        if (keys.length === 0) return;
        const analyticsData = [];

        for (const key of keys) {
            const { storeId, actionId, productId, platformId, timestamp } = await getRedisHash(key);
            const date = new Date(parseInt(timestamp, 10));
            const actionTime = date.toISOString();

            analyticsData.push([storeId, actionId, productId, platformId, actionTime]);
        }

        if (analyticsData.length > 0) {
            const query = `
                INSERT INTO analytics 
                (store_id, action_id, product_id, platform_id, timestamp) 
                VALUES ${analyticsData.map((_, i) => 
                    `($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${i * 5 + 5})`).join(', ')}
            `;

            try {
                await executeQuery(query, analyticsData.flat());
            } catch (error) {
                if (error.code === '23503') { 
                    await deleteRedisHash(keys[i]);
                }
                else {
                    console.error(error)
                }
            }
        }

        for (const key of keys) {
            await deleteRedisHash(key);
        }

    } catch (error) {
        console.error('Error transferring data to the database:', error);
    }
}

cron.schedule('*/10 * * * * *', async () => {
    try {
        await transferAnalyticsToDB();
    } catch (error) {
        console.error('Error in scheduled task:', error);
    }
});
