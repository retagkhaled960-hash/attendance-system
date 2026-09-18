const { Pool, types } = require('pg');
require('dotenv').config();
types.setTypeParser(1184, (value) => value);

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,
});

pool.on('connect', (client) => {
    client.query("SET TIME ZONE 'Africa/Cairo';");
});


module.exports = pool;
