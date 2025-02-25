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

async function getStudioById(id) {
  const { rows } = await pool.query(
    `SELECT * FROM studios WHERE studio_id = $1`,
    [id]
  );

  return rows.length > 0
    ? new Studio({
        id: rows.at(0).studio_id,
        name: rows.at(0).name,
        location: rows.at(0).location,
      })
    : null;
}

async function updateStudio({ id, name, location }) {
  const result = await pool.query(
    `UPDATE studios SET name = $1, location = $2
    WHERE studio_id = $3`,
    [name, location, id]
  );
  return result.rowCount;
}

async function saveStudio({ id, name, location }) {
  const result = await pool.query(
    `INSERT INTO studios (name, location) VALUES ($1, $2)`,
    [name, location]
  );
  return result.rowCount;
}

async function deleteStudio(id) {
  const result = await pool.query(`DELETE FROM studios WHERE studio_id = $1`, [
    id,
  ]);

  return result.rowCount;
}

module.exports = {
  getAllStudios,
  getStudioById,
  updateStudio,
  saveStudio,
  deleteStudio,
};
