const pool = require('../pool');

async function getAllDirectors() {
  const { rows } = await pool.query('SELECT * FROM directors');
  const directors = rows.map((director) => ({
    directorId: director.director_id,
    fullName: director.full_name,
    birthDate: director.birth_date,
  }));

  return directors;
}

module.exports = { getAllDirectors };
