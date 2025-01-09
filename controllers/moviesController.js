const moviesDb = require('../db/queries/moviesQueries');
const CustomNotFoundError = require('../errors/CustomNotFoundError');

async function moviesListGet(req, res) {
  const movies = await moviesDb.getAllMovies();
  res.render('movies/moviesList', { movies });
}

async function movieDetailsGet(req, res) {
  const movie = await moviesDb.getMovieById(req.query.id);

  if (!movie) throw new CustomNotFoundError('Movie not found');

  res.render('movies/movieDetails', { ...movie });
}

module.exports = { moviesListGet, movieDetailsGet };
