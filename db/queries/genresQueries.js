const pool = require('../pool');
const Genre = require('../../model/genre');

async function getAllGenres() {
  const { rows } = await pool.query('SELECT * FROM genres');
  return rows.map(
    (genre) => new Genre({ id: genre.genre_id, name: genre.genre_name })
  );
}

module.exports = { getAllGenres };
