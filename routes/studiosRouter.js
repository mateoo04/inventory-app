const { Router } = require('express');
const studiosController = require('../controllers/studiosController');

const studiosRouter = Router();

studiosRouter.get('/', studiosController.studiosListGet);

module.exports = studiosRouter;
