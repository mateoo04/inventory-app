const { Pool } = require('pg');

const databaseUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.PRODUCTION_DATABASE_URL
    : process.env.DEVELOPMENT_DATABASE_URL;

module.exports = new Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});
