const genresDb = require('../db/queries/genresQueries');
const CustomNotFoundError = require('../errors/CustomNotFoundError');

async function genresListGet(req, res) {
  const genres = await genresDb.getAllGenres();
  res.render('genres', { genres });
}

module.exports = { genresListGet };
