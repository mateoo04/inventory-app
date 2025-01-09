const pool = require('../pool');

async function getAllGenres() {
  const { rows } = await pool.query('SELECT * FROM genres');
  const genres = rows.map((genre) => ({
    genreId: genre.genre_id,
    name: genre.genre_name,
  }));
  return genres;
}

module.exports = { getAllGenres };
