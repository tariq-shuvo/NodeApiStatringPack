var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Load Api Routes 
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/api/user');
var adminRouter = require('./routes/api/admin');
var roleRouter = require('./routes/api/admin/roles');
var propertyRouter = require('./routes/api/property');
var propertyType = require('./routes/api/property/type');
var locationRouter = require('./routes/api/location');
var propertyProgressRouter = require('./routes/api/property/progress');

// Load Website Routes 
var authSiteRouter = require('./routes/website/auth');
var dashboardRouter = require('./routes/website/dashboard');

var app = express();

// Load Mongo Database Connection
var mongoConnection = require('./config/connectMongo')
mongoConnection()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// Api Routes 
app.use('/api/location', [locationRouter.getLocation]);
app.use('/api/user', [usersRouter.user, usersRouter.auth, usersRouter.verify, usersRouter.forgot, usersRouter.reset, usersRouter.contact, usersRouter.updatePhoto]);
app.use('/api/admin', [adminRouter.admin, adminRouter.auth, adminRouter.verify, adminRouter.forgot, adminRouter.reset]);
app.use('/api/role', [roleRouter.addRole, roleRouter.getRole, roleRouter.updateRole, roleRouter.removeRole]);
app.use('/api/property', [propertyRouter.addProperty, propertyRouter.getProperty, propertyRouter.updateProperty]);
app.use('/api/property/type', [propertyType.addPropertyType, propertyType.removePropertyType, propertyType.updatePropertyType, propertyType.getPropertyType]);
app.use('/api/property/progress', [propertyProgressRouter.addPropertyProgress, propertyProgressRouter.removePropertyProgress, propertyProgressRouter.updatePropertyProgress, propertyProgressRouter.getPropertyProgress]);

// Website Routes
app.use('/', [authSiteRouter.loginAuth, authSiteRouter.registerAuth, authSiteRouter.forgotAuth, authSiteRouter.resetAuth])
app.use('/', [dashboardRouter.homeRoute])

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
