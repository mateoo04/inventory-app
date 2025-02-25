const { Router } = require('express');
const genresController = require('../controllers/genresController');

const genresRouter = Router();

genresRouter.get('/', genresController.genresListGet);
genresRouter.get('/new', genresController.newGenreGet);
genresRouter.get('/:id/edit', genresController.editGenreGet);

genresRouter.put('/:id/update', genresController.genrePut);

genresRouter.post('/save', genresController.genrePost);

genresRouter.delete('/:id/delete', genresController.genreDelete);

module.exports = genresRouter;
