const pool = require('../pool');

async function getAllDirectors() {
  const { rows } = await pool.query('SELECT * FROM directors');
}

module.exports = { getAllDirectors };
