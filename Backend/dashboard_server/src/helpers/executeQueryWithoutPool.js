const getError = require('../../../shared_utils/getError');

const executeQueryWithoutPool = async ({ client, query, params = [] }) => {
    try {
        const result = await client.query(query, params);
        return result;
    } catch (error) {
        console.log(error);
        throw getError(500, 'Database query failed');
    }
};

module.exports = executeQueryWithoutPool;

