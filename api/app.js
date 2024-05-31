const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config(); // Asegúrate de requerir dotenv para usar variables de entorno

const indexRouter = require('./routes/index');
const juegosRouter = require('./routes/juegos'); 
const infoJuegoRouter = require('./routes/info_juego'); // Agrega esto

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const baseUri = process.env.BASE_URI || '/api/v1'; // Define un valor predeterminado si no está configurado

app.use('/', indexRouter);
app.use(baseUri + '/juegos', juegosRouter); 
app.use(baseUri + '/juego', infoJuegoRouter); // Agrega esto

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
