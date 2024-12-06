const cron = require('node-cron');
const { getRedisHash, deleteRedisHash, getAllRedisKeys } = require('../../../../shared_utils/redisHelpers');
const executeQuery = require('../../helpers/executeQuery');

const normalizeQuery = (query) => {
    let normalized = query
        .trim()
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .normalize('NFKC');

    if (normalized.length > 50) {
        normalized = normalized.slice(0, 47) + '...';
    }

    return normalized;
};

const transferTermsToDb = async () => {
    try {
        const keys = await getAllRedisKeys('terms*');
        if (keys.length === 0) return;

        const termsData = [];

        for (const key of keys) {
            const { storeId, query, platformId, timestamp } = await getRedisHash(key);

            const date = new Date(parseInt(timestamp, 10));
            const actionTime = date.toISOString();

            const normalizedQuery = normalizeQuery(query);
            termsData.push([storeId, normalizedQuery, platformId, actionTime]);
        }

        if (termsData.length > 0) {
            
            const query = `
                INSERT INTO terms 
                (store_id, term, platform_id, timestamp) 
                VALUES ${termsData.map((_, i) => 
                    `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`).join(', ')}
            `;

            try {
                await executeQuery(query, termsData.flat());
            } catch (error) {
                if (error.code === '23503') { 
                    await deleteRedisHash(keys[i]);
                } else {
                    console.error(error);
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
        await transferTermsToDb();
    } catch (error) {
        console.error('Error in scheduled task:', error);
    }
});
