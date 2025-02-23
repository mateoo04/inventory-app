const { body, validationResult } = require('express-validator');

const moviesDb = require('../db/queries/moviesQueries');
const directorsDb = require('../db/queries/directorsQueries');
const genresDb = require('../db/queries/genresQueries');
const studiosDb = require('../db/queries/studiosQueries');

const Movie = require('../model/movie');
const Genre = require('../model/genre');
const Studio = require('../model/studio');
const Director = require('../model/director');

const CustomNotFoundError = require('../errors/CustomNotFoundError');

const validateMovie = [
  body('title').notEmpty().withMessage('Title is required'),
  body('year')
    .notEmpty()
    .withMessage('Year is required')
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage('Invalid year'),
  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isInt({ min: 1, max: 10 })
    .withMessage('Rating must be a number 1 - 10'),
];

function extractMovieFromRequestBody(req) {
  const { title, year, genreId, directorId, studioId, rating, isWatched } =
    req.body;
  return new Movie({
    id: req.params.id,
    title,
    genre: new Genre({ id: genreId }),
    director: new Director({ id: directorId }),
    studio: new Studio({ id: studioId }),
    year,
    rating,
    isWatched: isWatched === 'on',
  });
}

async function moviesListGet(req, res, next) {
  try {
    const movies = await moviesDb.getAllMovies();
    res.render('movies/moviesList', { movies });
  } catch (err) {
    next(err);
  }
}

async function movieDetailsGet(req, res, next) {
  try {
    const movie = await moviesDb.getMovieById(req.params.id);

    if (!movie) {
      return next(new CustomNotFoundError('Movie not found'));
    }

    res.render('movies/movieDetails', { ...movie });
  } catch (err) {
    next(err);
  }
}

const moviePost = [
  validateMovie,
  async (req, res, next) => {
    try {
      const movie = extractMovieFromRequestBody(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400);
      } else {
        const rowCount = await moviesDb.saveMovie(movie);

        if (rowCount == 0) {
          return next(new Error('Unexpected database failure'));
        } else res.redirect('/');
      }
    } catch (err) {
      next(err);
    }
  },
];

const moviePut = [
  validateMovie,
  async (req, res, next) => {
    try {
      const movie = extractMovieFromRequestBody(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400);
        renderEditForm(
          res,
          movie,
          errors.array().map((error) => error.msg)
        );
      } else {
        const rowCount = await moviesDb.updateMovie(movie);

        if (rowCount == 0) {
          return next(new CustomNotFoundError('Movie not found'));
        } else res.redirect('/');
      }
    } catch (err) {
      next(err);
    }
  },
];

function newMovieGet(req, res) {
  renderEditForm(res, null);
}

async function editMovieGet(req, res) {
  const movie = await moviesDb.getMovieById(req.params.id);

  renderEditForm(res, movie);
}

async function renderEditForm(res, movie, errorMessages = []) {
  const directors = await directorsDb.getAllDirectors();
  const studios = await studiosDb.getAllStudios();
  const genres = await genresDb.getAllGenres();

  res.render('movies/editMovie', {
    movie,
    directors,
    studios,
    genres,
    errorMessages,
  });
}

async function movieDelete(req, res, next) {
  try {
    const rowCount = await moviesDb.deleteMovie(req.params.id);

    if (rowCount === 0)
      return res.render('error', { message: 'Movie not found' });

    res.redirect('/');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  moviesListGet,
  movieDetailsGet,
  moviePut,
  moviePost,
  editMovieGet,
  newMovieGet,
  movieDelete,
};
