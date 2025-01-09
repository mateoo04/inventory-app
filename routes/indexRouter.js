const { Router } = require('express');
const moviesRouter = require('./moviesRouter');
const directorsRouter = require('./directorsRouter');
const genresRouter = require('./genresRouter');
const studiosRouter = require('./studiosRouter');

const indexRouter = Router();

indexRouter.use('/', moviesRouter);
indexRouter.use('/directors', directorsRouter);
indexRouter.use('/genres', genresRouter);
indexRouter.use('/studios', studiosRouter);

module.exports = indexRouter;
