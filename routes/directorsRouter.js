const { Router } = require('express');
const directorsController = require('../controllers/directorsController');

const directorsRouter = Router();

directorsRouter.get('/', directorsController.directorsListGet);

module.exports = directorsRouter;
