const pool = require('../pool');
const { format } = require('date-fns');

async function getAllDirectors() {
  const { rows } = await pool.query('SELECT * FROM directors');
  const directors = rows.map((director) => ({
    directorId: director.director_id,
    fullName: director.full_name,
    birthDate: format(new Date(director.birth_date), 'd MMMM yyyy'),
  }));

  return directors;
}

module.exports = { getAllDirectors };
