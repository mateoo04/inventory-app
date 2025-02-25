const { format, addMonths } = require('date-fns');

const directorsDb = require('../db/queries/directorsQueries');
const Director = require('../model/director');
const CustomNotFoundError = require('../errors/CustomNotFoundError');

const { body, validationResult } = require('express-validator');

const validateDirector = [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('birthDate')
    .notEmpty()
    .withMessage('Date of birth is required')
    .isISO8601()
    .toDate()
    .custom((date) => {
      if (date > new Date() || date < new Date('1880-01-01'))
        throw new Error('Invalid date');

      return true;
    })
    .withMessage('Invalid date'),
];

function extractDirectorFromRequestBody(req) {
  return new Director({
    id: req.params.id,
    fullName: req.body.fullName,
    birthDate: req.body.birthDate,
  });
}

async function directorsListGet(req, res) {
  try {
    const directors = await directorsDb.getAllDirectors();
    res.render('directors/directorsList', { directors });
  } catch (err) {
    next(err);
  }
}

const directorPost = [
  validateDirector,
  async (req, res, next) => {
    try {
      const director = extractDirectorFromRequestBody(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.session.errorMessages = errors.array().map((error) => error.msg);
        req.session.director = director;

        return res.status(400).redirect(`/directors/new`);
      } else {
        const rowCount = await directorsDb.saveDirector(director);

        if (rowCount == 0) {
          return next(new Error('Unexpected database failure'));
        } else res.redirect('/directors');
      }
    } catch (err) {
      next(err);
    }
  },
];

const directorPut = [
  validateDirector,
  async (req, res, next) => {
    try {
      const director = extractDirectorFromRequestBody(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.session.errorMessages = errors.array().map((error) => error.msg);
        req.session.director = director;

        return res.status(400).redirect(`/directors/${director.id}/edit`);
      } else {
        const rowCount = await directorsDb.updateDirector(director);

        if (rowCount == 0) {
          return next(new CustomNotFoundError('Director not found'));
        } else res.redirect('/directors');
      }
    } catch (err) {
      next(err);
    }
  },
];

async function newDirectorGet(req, res, next) {
  try {
    const errorMessages = req.session.errorMessages || [];
    const director = req.session.director || null;

    delete req.session.errorMessages;
    delete req.session.director;

    res.render('directors/editDirector', {
      director,
      errorMessages,
      action: 'post',
    });
  } catch (err) {
    next(err);
  }
}

async function editDirectorGet(req, res, next) {
  try {
    const errorMessages = req.session.errorMessages || [];
    delete req.session.errorMessages;

    const director =
      req.session.director ||
      (await directorsDb.getDirectorById(req.params.id));
    delete req.session.director;

    director.birthDate = format(
      addMonths(new Date(director.birthDate), 1),
      'yyyy-MM-dd'
    );

    res.render('directors/editDirector', {
      director,
      errorMessages,
      action: 'put',
    });
  } catch (err) {
    next(err);
  }
}

async function directorDelete(req, res, next) {
  try {
    const rowCount = await directorsDb.deleteDirector(req.params.id);

    if (rowCount === 0)
      return res.render('error', { message: 'Director not found' });

    res.redirect('/directors');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  directorsListGet,
  newDirectorGet,
  editDirectorGet,
  directorPut,
  directorPost,
  directorDelete,
};
