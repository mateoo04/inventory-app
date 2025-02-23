const { Router } = require('express');
const moviesController = require('../controllers/moviesController');

const moviesRouter = Router();

moviesRouter.get('/', moviesController.moviesListGet);
moviesRouter.get('/movie/new', moviesController.newMovieGet);
moviesRouter.get('/movie/:id', moviesController.movieDetailsGet);
moviesRouter.get('/movie/:id/edit', moviesController.editMovieGet);

moviesRouter.post('/movie/save', moviesController.moviePost);

moviesRouter.put('/movie/:id/update', moviesController.moviePut);

moviesRouter.delete('/movie/:id/delete', moviesController.movieDelete);

module.exports = moviesRouter;
