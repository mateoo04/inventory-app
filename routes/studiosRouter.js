const { Router } = require('express');
const studiosController = require('../controllers/studiosController');

const studiosRouter = Router();

studiosRouter.get('/', studiosController.studiosListGet);
studiosRouter.get('/new', studiosController.newStudioGet);
studiosRouter.get('/:id/edit', studiosController.editStudioGet);

studiosRouter.put('/:id/update', studiosController.studioPut);

studiosRouter.post('/save', studiosController.studioPost);

studiosRouter.delete('/:id/delete', studiosController.studioDelete);

module.exports = studiosRouter;
