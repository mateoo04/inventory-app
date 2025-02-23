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

module.exports = { getAllDirectors };
