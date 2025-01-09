const { Router } = require('express');
const moviesController = require('../controllers/moviesController');

const moviesRouter = Router();

moviesRouter.get('/', moviesController.moviesListGet);
moviesRouter.get('/movie', moviesController.movieDetailsGet);

module.exports = moviesRouter;
