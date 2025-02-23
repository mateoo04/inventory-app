const pool = require('../pool');
const Studio = require('../../model/studio');

async function getAllStudios() {
  const { rows } = await pool.query('SELECT * FROM studios');
  return rows.map(
    (studio) =>
      new Studio({
        id: studio.studio_id,
        name: studio.name,
        location: studio.location,
      })
  );
}

module.exports = { getAllStudios };
