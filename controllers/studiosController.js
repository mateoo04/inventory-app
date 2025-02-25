const studiosDb = require('../db/queries/studiosQueries');
const CustomNotFoundError = require('../errors/CustomNotFoundError');
const Studio = require('../model/studio');

const { body, validationResult } = require('express-validator');

const validateStudio = [
  body('name').notEmpty().withMessage('Studio name is required'),
  body('location').notEmpty().withMessage('Studio location is required'),
];

function extractStudioFromRequestBody(req) {
  return new Studio({
    id: req.params.id,
    name: req.body.name,
    location: req.body.location,
  });
}

async function studiosListGet(req, res) {
  const studios = await studiosDb.getAllStudios();
  res.render('studios/studiosList', { studios });
}
const studioPost = [
  validateStudio,
  async (req, res, next) => {
    try {
      const studio = extractStudioFromRequestBody(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.session.errorMessages = errors.array().map((error) => error.msg);
        req.session.studio = studio;

        return res.status(400).redirect(`/studios/new`);
      } else {
        const rowCount = await studiosDb.saveStudio(studio);

        if (rowCount == 0) {
          return next(new Error('Unexpected database failure'));
        } else res.redirect('/studios');
      }
    } catch (err) {
      next(err);
    }
  },
];

const studioPut = [
  validateStudio,
  async (req, res, next) => {
    try {
      const studio = extractStudioFromRequestBody(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.session.errorMessages = errors.array().map((error) => error.msg);
        req.session.studio = studio;

        return res.status(400).redirect(`/studios/${studio.id}/edit`);
      } else {
        const rowCount = await studiosDb.updateStudio(studio);

        if (rowCount == 0) {
          return next(new CustomNotFoundError('Studio not found'));
        } else res.redirect('/studios');
      }
    } catch (err) {
      next(err);
    }
  },
];

async function newStudioGet(req, res, next) {
  try {
    const errorMessages = req.session.errorMessages || [];
    const studio = req.session.studio || null;

    delete req.session.errorMessages;
    delete req.session.studio;

    res.render('studios/editStudio', {
      studio,
      errorMessages,
      action: 'post',
    });
  } catch (err) {
    next(err);
  }
}

async function editStudioGet(req, res, next) {
  try {
    const errorMessages = req.session.errorMessages || [];
    delete req.session.errorMessages;

    const studio =
      req.session.studio || (await studiosDb.getStudioById(req.params.id));
    delete req.session.studio;

    res.render('studios/editStudio', {
      studio,
      errorMessages,
      action: 'put',
    });
  } catch (err) {
    next(err);
  }
}

async function studioDelete(req, res, next) {
  try {
    const rowCount = await studiosDb.deleteStudio(req.params.id);

    if (rowCount === 0)
      return res.render('error', { message: 'Studio not found' });

    res.redirect('/studios');
  } catch (err) {
    next(err);
  }
}
module.exports = {
  studiosListGet,
  studioPut,
  studioPost,
  studioDelete,
  newStudioGet,
  editStudioGet,
};
