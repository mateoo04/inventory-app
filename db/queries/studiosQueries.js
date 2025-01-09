const pool = require('../pool');

async function getAllStudios() {
  const { rows } = await pool.query('SELECT * FROM studios');
  const studios = rows.map((studio) => ({
    studioId: studio.studio_id,
    name: studio.name,
    location: studio.location,
  }));
  return studios;
}

module.exports = { getAllStudios };
