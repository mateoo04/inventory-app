const genresDb = require('../db/queries/genresQueries');
const CustomNotFoundError = require('../errors/CustomNotFoundError');
const Genre = require('../model/genre');

const { body, validationResult } = require('express-validator');

const validateGenre = [
  body('name').notEmpty().withMessage('Genre name is required'),
];

function extractGenreFromRequestBody(req) {
  return new Genre({ id: req.params.id, name: req.body.name });
}

async function genresListGet(req, res) {
  const genres = await genresDb.getAllGenres();
  res.render('genres/genresList', { genres });
}

const genrePost = [
  validateGenre,
  async (req, res, next) => {
    try {
      const genre = extractGenreFromRequestBody(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.session.errorMessages = errors.array().map((error) => error.msg);
        req.session.genre = genre;

        return res.status(400).redirect(`/genres/new`);
      } else {
        const rowCount = await genresDb.saveGenre(genre);

        if (rowCount == 0) {
          return next(new Error('Unexpected database failure'));
        } else res.redirect('/genres');
      }
    } catch (err) {
      next(err);
    }
  },
];

const genrePut = [
  validateGenre,
  async (req, res, next) => {
    try {
      const genre = extractGenreFromRequestBody(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.session.errorMessages = errors.array().map((error) => error.msg);
        req.session.genre = genre;

        return res.status(400).redirect(`/genres/${genre.id}/edit`);
      } else {
        const rowCount = await genresDb.updateGenre(genre);

        if (rowCount == 0) {
          return next(new CustomNotFoundError('Genre not found'));
        } else res.redirect('/genres');
      }
    } catch (err) {
      next(err);
    }
  },
];

async function newGenreGet(req, res, next) {
  try {
    const errorMessages = req.session.errorMessages || [];
    const genre = req.session.genre || null;

    delete req.session.errorMessages;
    delete req.session.genre;

    res.render('genres/editGenre', {
      genre,
      errorMessages,
      action: 'post',
    });
  } catch (err) {
    next(err);
  }
}

async function editGenreGet(req, res, next) {
  try {
    const errorMessages = req.session.errorMessages || [];
    delete req.session.errorMessages;

    const genre =
      req.session.genre || (await genresDb.getGenreById(req.params.id));
    delete req.session.genre;

    res.render('genres/editGenre', {
      genre,
      errorMessages,
      action: 'put',
    });
  } catch (err) {
    next(err);
  }
}

async function genreDelete(req, res, next) {
  try {
    const rowCount = await genresDb.deleteGenre(req.params.id);

    if (rowCount === 0)
      return res.render('error', { message: 'Genre not found' });

    res.redirect('/genres');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  genresListGet,
  newGenreGet,
  editGenreGet,
  genrePost,
  genrePut,
  genreDelete,
};
