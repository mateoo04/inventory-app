const { Router } = require('express');

const moviesController = require('../controllers/moviesController');
const directorsController = require('../controllers/directorsController');
const genresController = require('../controllers/genresController');
const studiosController = require('../controllers/studiosController');

const indexRouter = Router();

indexRouter.get('/', moviesController.moviesListGet);
indexRouter.get('/directors', directorsController.directorsListGet);
indexRouter.get('/genres', genresController.genresListGet);
indexRouter.get('/studios', studiosController.studiosListGet);

module.exports = indexRouter;
