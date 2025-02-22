const { body, validationResult } = require('express-validator');

const moviesDb = require('../db/queries/moviesQueries');
const directorsDb = require('../db/queries/directorsQueries');
const genresDb = require('../db/queries/genresQueries');
const studiosDb = require('../db/queries/studiosQueries');

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

async function moviesListGet(req, res) {
  const movies = await moviesDb.getAllMovies();
  res.render('movies/moviesList', { movies });
}

async function movieDetailsGet(req, res, next) {
  try {
    const movie = await moviesDb.getMovieById(req.params.id);

    res.render('movies/movieDetails', { ...movie });
  } catch (err) {
    next(err);
  }
}

async function moviePost(req, res) {
  const { title, year, genreId, directorId, studioId, rating, isWatched } =
    req.body;

  if (
    !validateMovieInput(res, title, year, rating, genreId, directorId, studioId)
  ) {
    return;
  }

  try {
    await moviesDb.saveMovie({
      id: req.params.id,
      title,
      year,
      genreId,
      directorId,
      studioId,
      rating,
      isWatched: isWatched == 'on' ? 'true' : 'false',
    });

    res.redirect('/');
  } catch {
    res.status(505).send('Server error');
  }
}

async function moviePut1(req, res) {
  const { title, year, genreId, directorId, studioId, rating, isWatched } =
    req.body;

  if (
    !validateMovieInput(res, title, year, rating, genreId, directorId, studioId)
  ) {
    return;
  }

  try {
    const rowCount = await moviesDb.updateMovie({
      id: req.params.id,
      title,
      year,
      genreId,
      directorId,
      studioId,
      rating,
      isWatched: isWatched == 'on' ? 'true' : 'false',
    });

    if (rowCount == 0) {
      return res.status(404).send({ message: 'Movie not found' });
    }

    res.redirect('/');
  } catch {
    res.status(505).send('Server error');
  }
}

const moviePut = [
  validateMovie,
  async (req, res) => {
    const { title, year, genreId, directorId, studioId, rating, isWatched } =
      req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      renderEditForm(
        res,
        req.params.id,
        title,
        genreId,
        directorId,
        studioId,
        year,
        rating,
        isWatched,
        errors.array().map((error) => error.msg)
      );
    } else {
      const rowCount = await moviesDb.updateMovie({
        id: req.params.id,
        title,
        year,
        genreId,
        directorId,
        studioId,
        rating,
        isWatched: isWatched == 'on' ? 'true' : 'false',
      });

      if (rowCount == 0) {
        next(res.status(404).send({ message: 'Movie not found' }));
      } else res.redirect('/');
    }
  },
];

async function renderEditMovie(req, res) {
  const {
    movieId,
    title,
    genreId,
    directorId,
    studioId,
    year,
    rating,
    isWatched,
  } = await moviesDb.getMovieById(req.params.id);

  renderEditForm(
    res,
    movieId,
    title,
    genreId,
    directorId,
    studioId,
    year,
    rating,
    isWatched
  );
}

async function renderEditForm(
  res,
  id,
  title,
  genreId,
  directorId,
  studioId,
  year,
  rating,
  isWatched,
  errorMessages = []
) {
  const directors = await directorsDb.getAllDirectors();
  const studios = await studiosDb.getAllStudios();
  const genres = await genresDb.getAllGenres();

  res.render('movies/editMovie', {
    movie: {
      id,
      title,
      genreId,
      directorId,
      studioId,
      year,
      rating,
      isWatched,
    },
    directors,
    studios,
    genres,
    errorMessages,
  });
}

module.exports = { moviesListGet, movieDetailsGet, moviePut, renderEditMovie };
