const executeQueryWithoutPool = require('../helpers/executeQueryWithoutPool');
const executeQuery = require('../helpers/executeQuery');
const getError = require('../../../shared_utils/getError');
const pool = require('../helpers/db');
const oneWayHash = require('../helpers/oneWayHash');
const speakeasy = require('speakeasy');
const generateQrForLogin = require('../helpers/generateQrForLogin');
const { v4: uuidv4 } = require('uuid');
const { 
    setRedisText, 
    getRedisText, 
} = require('../../../shared_utils/redisHelpers');
const { 
    checkStoresExist, 
    checkUserExistsById,
} = require('../helpers/service_helpers');
const { 
    decrypt, 
    encrypt,
} = require('../../../shared_utils/encrypt');

const createUserService = async ({ email, stores: storeIds }) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const hashedEmail = oneWayHash(email);
        
        const userExistsResult = await executeQueryWithoutPool({
            client,
            query: 'SELECT id FROM users WHERE email_hash = $1',
            params: [hashedEmail]
        });

        if (userExistsResult.rows.length > 0)
            throw getError(409, 'User with this email already exists.');
        
        const secret = speakeasy.generateSecret({ length: 20 }).base32;

        const userResult = await executeQueryWithoutPool({
            client, 
            query: 'INSERT INTO users (email_encrypted, email_hash, secret) VALUES ($1, $2, $3) RETURNING id',
            params: [encrypt(email), hashedEmail, encrypt(secret)]
        });

        const userId = userResult.rows[0].id;

        await checkStoresExist(client, storeIds);

        for (const storeId of storeIds) {
            await executeQueryWithoutPool({
                client, 
                query: 'INSERT INTO user_store_access (user_id, store_id) VALUES ($1, $2)',
                params: [userId, storeId]
            })
        };

        const qr = await generateQrForLogin(secret, email);

        await client.query('COMMIT');

        return { sucess: true, qr, }

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const loginUserService = async ({ email }) => {
    const hashedEmail = oneWayHash(email);
    
    const result = await executeQuery(
        'SELECT id FROM users WHERE email_hash = $1', 
        [hashedEmail]
    );
    if(result.rowCount === 0) 
        throw getError(404, 'Email was not found.')

    const userId = result.rows[0].id;

    return { userId };
    
}

const verifyUserService = async ({ id, token, }) => {
    const result = await executeQuery(
        'SELECT secret FROM users WHERE id = $1', 
        [id]
    );
    
    if(result.rowCount === 0) 
        throw getError(404, 'User with such id was not found.')
    
    const { secret } = result.rows[0];

    const verified = speakeasy.totp.verify({
        encoding: 'base32',
        secret: decrypt(secret),
        token: token,
    });

    if(!verified) 
        throw getError(401, 'Verification failed. Wrong token');

    const existingToken = await getRedisText(`authToken:${id}`);

    if (existingToken) {
        return { authToken: existingToken}
    } else {
        const createdToken = uuidv4();
        await setRedisText(`authToken:${id}`, createdToken, 36000);

        return { authToken: createdToken }
    }
    
}

const deleteUserService = async ({ id }) => {
    const client = await pool.connect(); 
    try {
        await checkUserExistsById(client, id);

        await executeQueryWithoutPool({
            client,
            query: 'DELETE FROM user_store_access WHERE user_id = $1',
            params: [id]
        });

        await executeQueryWithoutPool({
            client,
            query: 'DELETE FROM users WHERE id = $1',
            params: [id]
        });

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

const getUserStoresService = async ({ id }) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await checkUserExistsById(client, id);

        // Query to check if the user is an admin
        const adminCheckQuery = `
            SELECT is_admin 
            FROM users 
            WHERE id = $1
        `;

        const adminResult = await executeQueryWithoutPool({
            client,
            query: adminCheckQuery,
            params: [id],
        });

        const isAdmin = adminResult.rows[0]?.is_admin;

        let storeQuery;
        let queryParams;

        if (isAdmin) {
            // Return all stores if the user is an admin
            storeQuery = `
                SELECT id, store_name, account_name
                FROM stores
            `;
            queryParams = [];
        } else {
            // Return only the stores the user has access to
            storeQuery = `
                SELECT stores.id, stores.store_name
                FROM stores 
                INNER JOIN user_store_access 
                ON stores.id = user_store_access.store_id 
                WHERE user_store_access.user_id = $1
            `;
            queryParams = [id];
        }

        const result = await executeQueryWithoutPool({
            client,
            query: storeQuery,
            params: queryParams,
        });

        if (result.rows.length === 0) {
            throw getError(404, 'No stores were found for the specified user ID.');
        }

        await client.query('COMMIT');
        return result.rows;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const updateUserStoresService = async ({ id, stores: storeIds }) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await checkUserExistsById(client, id);

        const validStoreIds = await checkStoresExist(client, storeIds);

        const existingAccess = await executeQueryWithoutPool({
            client,
            query: 'SELECT store_id FROM user_store_access WHERE user_id = $1',
            params: [id]
        });

        const existingStoreIds = existingAccess.rows.map(row => row.store_id);
        const newStoreIds = validStoreIds.filter(id => !existingStoreIds.includes(id));
        const storeIdsToRemove = existingStoreIds.filter(id => !validStoreIds.includes(id));

        for (const storeId of newStoreIds) {
            await executeQueryWithoutPool({
                client,
                query: 'INSERT INTO user_store_access (user_id, store_id) VALUES ($1, $2)',
                params: [id, storeId]
            });
        }

        for (const storeId of storeIdsToRemove) {
            await executeQueryWithoutPool({
                client,
                query: 'DELETE FROM user_store_access WHERE user_id = $1 AND store_id = $2',
                params: [id, storeId]
            });
        }

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};


module.exports = {
    createUserService,
    loginUserService,
    verifyUserService,
    deleteUserService,
    getUserStoresService,
    updateUserStoresService,
};