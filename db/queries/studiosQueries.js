const pool = require('../pool');

async function getAllStudios() {
  const { rows } = await pool.query('SELECT * FROM studios');
}

module.exports = { getAllStudios };
