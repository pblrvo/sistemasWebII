const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config(); // Asegúrate de requerir dotenv para usar variables de entorno

const indexRouter = require('./routes/index');
const juegosRouter = require('./routes/juegos'); 
const noticiasRouter = require('./routes/noticias'); 
const juegosGratuitosRouter = require('./routes/juegos-gratuitos'); 
const infoJuegoRouter = require('./routes/info_juego'); 
const editJuegoRouter = require('./routes/edit_juego'); 

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const baseUri = process.env.BASE_URI || '/api/v1';

app.use('/', indexRouter);
app.use(baseUri + '/juegos', juegosRouter);
app.use(baseUri + '/noticias', noticiasRouter);
app.use(baseUri + '/juegos-gratuitos', juegosGratuitosRouter);
app.use(baseUri + '/info_juego', infoJuegoRouter);
app.use(baseUri + '/edit_juego', editJuegoRouter);

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
  res.render('error');
});

module.exports = app;
