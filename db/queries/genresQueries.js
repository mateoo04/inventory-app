const pool = require('../pool');
const Genre = require('../../model/genre');

async function getAllGenres() {
  const { rows } = await pool.query('SELECT * FROM genres');
  return rows.map(
    (genre) => new Genre({ id: genre.genre_id, name: genre.genre_name })
  );
}

async function getGenreById(id) {
  const { rows } = await pool.query(
    `SELECT * FROM genres WHERE genre_id = $1`,
    [id]
  );

  return rows.length > 0
    ? new Genre({ id: rows.at(0).genre_id, name: rows.at(0).genre_name })
    : null;
}

async function updateGenre({ id, name }) {
  const result = await pool.query(
    `UPDATE genres SET genre_name = $1 WHERE
    genre_id = $2`,
    [name, id]
  );
  return result.rowCount;
}

async function saveGenre({ name }) {
  const result = await pool.query(
    `INSERT INTO genres (genre_name) VALUES($1)`,
    [name]
  );
  return result.rowCount;
}

async function deleteGenre(id) {
  const result = await pool.query(`DELETE FROM genres WHERE genre_id = $1`, [
    id,
  ]);
  return result.rowCount;
}

module.exports = {
  getAllGenres,
  getGenreById,
  updateGenre,
  saveGenre,
  deleteGenre,
};
