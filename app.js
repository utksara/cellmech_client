var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var usersRouter = require('./routes/users');
var app = express();

const {get_file_text} = require('./lib/file_functions.js')

// view engine setup
app.set('views', path.join(__dirname, 'views'));

// app.engine('html', require('ejs').renderFile);
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('src'))
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, './src')))
app.use('/images', express.static(path.join(__dirname,'src/images')))

const options = {
  root: path.join(__dirname, ''),
  headers: {
    'x-timestamp': Date.now(),
    'x-sent': true
  }
}

let callback = function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Sent:', );
  }
}

// app.get('/', function (req, res) { 
//   let fileName = 'index.html'
//   res.sendFile(fileName, options, callback)
// });

app.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

app.get('/cell', function (req, res) { 
  let fileName = 'src/javascripts/index.html'
  res.sendFile(fileName, options, callback)
});

app.get('/custom-simulation', function (req, res) { 
  let fileName = 'src/beehive.html'
  res.sendFile(fileName, options, callback)
});

let changefile = async function(){
}

app.get('/simple-laplace', function(req, res) {
  get_file_text ('simple-laplace', data => {
      send_json = {}
      send_json.file_text = data
      res.render('saved_simulation', send_json)
    });
});

app.get('/second-order-ode', function(req, res) {
  get_file_text ('second-order-ode', data => {
      send_json = {}
      send_json.file_text = data
      res.render('saved_simulation', send_json)
    });
});

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
// app.use(express.static('public'))
module.exports = app;
