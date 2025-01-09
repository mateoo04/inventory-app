const pool = require('../pool');

async function getAllMovies() {
  const { rows } = await pool.query('SELECT * FROM movies');
}

module.exports = { getAllMovies };
