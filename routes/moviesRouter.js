const { Router } = require('express');
const moviesController = require('../controllers/moviesController');

const moviesRouter = Router();

moviesRouter.get('/', moviesController.moviesListGet);
moviesRouter.get('/movie/:id', moviesController.movieDetailsGet);
moviesRouter.get('/movie/:id/edit', moviesController.renderEditMovie);

moviesRouter.put('/movie/:id/update', moviesController.moviePut);

module.exports = moviesRouter;
