global.config = require('./config');
var config = global.config;
var async = require('async');
var hbs = require('express-hbs');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();
app.engine('hbs', hbs.express3({
//  partialsDir: __dirname + '/views/partials',
  defaultLayout: __dirname + '/views/layouts/default.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(require('serve-static')(path.join(__dirname, '/public/assets')));
app.use(require('morgan')(config.log.morgan));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(require('cookie-parser')());
app.use(require('cors')({
  'origin': true,
  'credentials': true,
  'headers': ['X-CSRF-Token', 'X-Requested-With', 'Accept', 'Accept-Version', 'Content-Length', 'Content-MD5', 'Content-Type', 'Date', 'X-Api-Version'],
  'methods': ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  'maxAge': 32000
}));

app.use('/up', require('./routes/upload'));
app.use('/dn', require('./routes/download'));

app.use('/', function(req, res) {
  res.render('index');
});

/// error handlers
if(app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.json(err.status || 500, {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.json(err.status || 500, {
    message: err.message,
    error: {}
  });
});

var server = app.listen(config.port, function() {
  console.log('Express server listening on port ' + server.address().port);
});