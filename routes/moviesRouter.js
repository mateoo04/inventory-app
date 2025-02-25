const { Router } = require('express');
const moviesController = require('../controllers/moviesController');

const moviesRouter = Router();

moviesRouter.get('/', moviesController.moviesListGet);
moviesRouter.get('/movies/new', moviesController.newMovieGet);
moviesRouter.get('/movies/:id', moviesController.movieDetailsGet);
moviesRouter.get('/movies/:id/edit', moviesController.editMovieGet);

moviesRouter.post('/movies/save', moviesController.moviePost);

moviesRouter.put('/movies/:id/update', moviesController.moviePut);

moviesRouter.delete('/movies/:id/delete', moviesController.movieDelete);

module.exports = moviesRouter;
