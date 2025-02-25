const pool = require('../pool');
const { format } = require('date-fns');
const Director = require('../../model/director');

async function getAllDirectors() {
  const { rows } = await pool.query('SELECT * FROM directors');

  return rows.map(
    (director) =>
      new Director({
        id: director.director_id,
        fullName: director.full_name,
        birthDate: format(new Date(director.birth_date), 'd MMMM yyyy'),
      })
  );
}

async function getDirectorById(id) {
  const { rows } = await pool.query(
    'SELECT * FROM directors WHERE director_id = $1',
    [id]
  );

  return rows.length > 0
    ? new Director({
        id: rows.at(0).director_id,
        fullName: rows.at(0).full_name,
        birthDate: format(new Date(rows.at(0).birth_date), 'd MMMM yyyy'),
      })
    : null;
}

async function updateDirector({ id, fullName, birthDate }) {
  const result = await pool.query(
    `UPDATE directors SET full_name = $1,
    birth_date = $2 WHERE director_id = $3`,
    [fullName, birthDate, id]
  );

  return result.rowCount;
}

async function saveDirector({ fullName, birthDate }) {
  const result = await pool.query(
    `INSERT INTO directors (full_name, birth_date)
    VALUES($1, $2)`,
    [fullName, birthDate]
  );

  return result.rowCount;
}

async function deleteDirector(id) {
  const result = await pool.query(
    `DELETE FROM directors WHERE director_id = $1`,
    [id]
  );
  return result.rowCount;
}

module.exports = {
  getAllDirectors,
  getDirectorById,
  updateDirector,
  saveDirector,
  deleteDirector,
};
