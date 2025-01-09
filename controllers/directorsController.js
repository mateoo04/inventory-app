const directorsDb = require('../db/queries/directorsQueries');
const CustomNotFoundError = require('../errors/CustomNotFoundError');

async function directorsListGet(req, res) {
  const directors = await directorsDb.getAllDirectors();
  res.render('directors', { directors });
}

module.exports = { directorsListGet };
