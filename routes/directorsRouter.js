const { Router } = require('express');
const directorsController = require('../controllers/directorsController');

const directorsRouter = Router();

directorsRouter.get('/', directorsController.directorsListGet);
directorsRouter.get('/new', directorsController.newDirectorGet);
directorsRouter.get('/:id/edit', directorsController.editDirectorGet);

directorsRouter.put('/:id/update', directorsController.directorPut);

directorsRouter.post('/save', directorsController.directorPost);

directorsRouter.delete('/:id/delete', directorsController.directorDelete);

module.exports = directorsRouter;
