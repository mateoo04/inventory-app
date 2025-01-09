const moviesDb = require('../db/queries/moviesQueries');
const CustomNotFoundError = require('../errors/CustomNotFoundError');

async function moviesListGet(req, res) {
  const movies = await moviesDb.getAllMovies();
  res.render('movies', { movies });
}

module.exports = { moviesListGet };
