var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require('./config.json');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/userRoutes');
var packageRouter = require('./routes/packageRoutes');
var mailboxRouter=require('./routes/mailboxRoutes');
var packageAccessRouter=require('./routes/packageAccessRoutes');
var userFaceRouter=require('./routes/userFaceRoutes');
var app = express();

var mongoose = require('mongoose');
var mongoDB = config.dbString;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

//shranjevanje seje
var session = require('express-session');
var MongoStore = require('connect-mongo');
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: mongoDB })
}));


//na vsaki strani dostop do session spremenljivk ter nastavitev titla
app.use(function(req, res, next){
  res.locals.session = req.session;
  res.locals.title="Pametni paketnik"
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/package', packageRouter);
app.use('/mailbox',mailboxRouter);
app.use('/packageAccess',packageAccessRouter);
app.use('/face',userFaceRouter);

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
