require('dotenv').config();
const express = require('express');
const path = require('node:path');
const methodOverride = require('method-override');
const session = require('express-session');

const indexRouter = require('./routes/indexRouter');

const app = express();
const port = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(
  session({
    secret: 'mateos-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' },
  })
);

app.use('/', indexRouter);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500);
  res.render('error', { message: `${err.statusCode} Error` });
});

app.listen(port, () =>
  console.log(`Server running - listening on port ${port}`)
);
