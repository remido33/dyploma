const { checkStoreExistsById } = require('../helpers/service_helpers');
const { analyticActions } = require('../helpers/extraData');
const pool = require('../helpers/db');
const executeQueryWithoutPool = require('../helpers/executeQueryWithoutPool');
const { getAnalyticsActionId,  } = require('../helpers/extraData');
const queries = require('../helpers/dbQueries');
const elastic = require('../../../shared_utils/elastic');

const getAnalyticsService = async ({ storeId, startDate, endDate }) => {
    const client = await pool.connect();

    try {
        await checkStoreExistsById(client, storeId);

        const dayDiff = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
        const extractHourly = dayDiff <= 2;
        
        const results = {};
        for (const action of analyticActions) {
            let query = '';
            const params = [storeId, startDate, endDate];

            const ifPopAction = action.endsWith('Pop');

            if (ifPopAction) {
                const actionType = action.replace('Pop', '');
                query = queries.analytics.popular;
                params.push(getAnalyticsActionId(actionType));
            } else {
                extractHourly
                    ?  query = queries.analytics.actionsHourly
                    : query = queries.analytics.actionsDaily

                params.push(getAnalyticsActionId(action));
            };

            const result = await executeQueryWithoutPool({
                client,
                query,
                params,
            });

            const allCountsZero = result.rows.every(row => row.total_count === '0');
            if (allCountsZero || result.rows.length === 0) {
                results[action] = [];
            } 
            else {
                if(ifPopAction) {

                    const popularProducts = result.rows;

                    const response = await elastic.mget({
                        body: {
                            docs: popularProducts.map(({ value }) => ({
                            _index: `${storeId}_products`,
                            _id: value,
                            _source: ['id', 'title']
                        }))
                        }
                    });
                
                    const products = response.docs
                        .filter(doc => doc.found)
                        .map(doc => doc._source)
                        .map(i => ({ 
                            ...i, 
                            count: popularProducts.find(({ value }) => value === i.id.toString()).count
                        }))
                        
                    results[action] = products
                }
                else {
                    results[action] = result.rows;
                }
            }
        }

        const termResult = await executeQueryWithoutPool({
            client,
            query: queries.analytics.terms,
            params: [storeId, startDate, endDate],
        });

        const purchasesResult = await executeQueryWithoutPool({
            client,
            query: extractHourly ? queries.analytics.purchasesHourly : queries.analytics.purchasesDaily,
            params: [storeId, startDate, endDate],
        });

        results.terms = termResult.rows.length === 0 ? [] : termResult.rows;
        results.purchases = purchasesResult.rows.length === 0 ? [] : purchasesResult.rows;

        return results;
    } catch (err) {
        throw err;
    } finally {
        await client.release();
    }
};

module.exports = {
    getAnalyticsService,
};