var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();

var indexRouter = require('./routes/index');
var juegosRouter = require('./routes/juegos');
var noticiasRouter = require('./routes/noticias');
var newGameRouter = require('./routes/new_game');
var juegosGratuitosRouter = require('./routes/juegos-gratuitos');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const baseUri = process.env.BASE_URI || '/cliente/v1';

// Ruta de redirección
app.get(baseUri, function (req, res, next) {
  res.redirect(baseUri + '/juegos');
});

app.use(baseUri + '/', indexRouter);
app.use(baseUri + '/juegos', juegosRouter);
app.use(baseUri + '/noticias', noticiasRouter);
app.use(baseUri + '/new_game', newGameRouter);
app.use(baseUri + '/juegos-gratuitos', juegosGratuitosRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {err});
});

module.exports = app;
