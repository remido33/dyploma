const { Pool } = require('pg');

const pool = new Pool({
    user: 'remido',
    host: 'localhost',
    database: 'database',
    port: 5432,
});

module.exports = pool;
