var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require('config')

// Load Api Routes 
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/api/user');
var adminRouter = require('./routes/api/admin');
var roleRouter = require('./routes/api/admin/roles');
var projectRouter = require('./routes/api/property/project');
var propertyRouter = require('./routes/api/property'); 
var propertyDivisionRouter = require('./routes/api/property/division'); 
var propertyType = require('./routes/api/property/type');
var partitionType = require('./routes/api/property/partitionType');
var locationRouter = require('./routes/api/location');
// var propertyProgressRouter = require('./routes/api/property/progress');
// var propertySellRouter = require('./routes/api/property/sell');
var projectTypeRouter = require('./routes/api/property/projectType');
var expendetureTypeRouter = require('./routes/api/expendeture/type');
var expendetureRouter = require('./routes/api/expendeture');
var incomeTypeRouter = require('./routes/api/income/type');
var incomeRouter = require('./routes/api/income');

// Load Website Routes 
var authSiteRouter = require('./routes/website/auth');
var dashboardRouter = require('./routes/website/dashboard');
var propertyAdminRouter = require('./routes/website/property');
var projectAdminRouter = require('./routes/website/project');
var progressAdminRouter = require('./routes/website/progress');
var partitionAdminRouter = require('./routes/website/partition');
var propertySellAdminRouter = require('./routes/website/sell');
var propertyPaymentAdminRouter = require('./routes/website/payment');
var userAdminRouter = require('./routes/website/user');
var assessmentAdminRouter = require('./routes/website/assessment');

var app = express();

// Load Mongo Database Connection
var mongoConnection = require('./config/connectMongo')
mongoConnection()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// Api Routes 
app.use('/api/location', [locationRouter.getLocation]);
app.use('/api/user', [usersRouter.user, usersRouter.auth, usersRouter.verify, usersRouter.forgot, usersRouter.reset, usersRouter.contact, usersRouter.updatePhoto]);
app.use('/api/admin', [adminRouter.admin, adminRouter.auth, adminRouter.verify, adminRouter.forgot, adminRouter.reset, adminRouter.getAdminData, adminRouter.removeAdminData, adminRouter.updateAdminData]);
app.use('/api/role', [roleRouter.addRole, roleRouter.getRole, roleRouter.updateRole, roleRouter.removeRole]);
app.use('/api/property', [propertyRouter.addProperty, propertyRouter.getProperty, propertyRouter.updateProperty, propertyRouter.removeProperty]);
app.use('/api/property/division', [propertyDivisionRouter.addPropertyDivision, propertyDivisionRouter.getPropertyDivision, propertyDivisionRouter.updatePropertyDivision, propertyDivisionRouter.removePropertyDivision]);
app.use('/api/property/type', [propertyType.addPropertyType, propertyType.removePropertyType, propertyType.updatePropertyType, propertyType.getPropertyType]);
app.use('/api/partition/type', [partitionType.addPartitionType, partitionType.removePartitionType, partitionType.updatePartitionType, partitionType.getPartitionType]);
// app.use('/api/property/progress', [propertyProgressRouter.addPropertyProgress, propertyProgressRouter.removePropertyProgress, propertyProgressRouter.updatePropertyProgress, propertyProgressRouter.getPropertyProgress]);
// app.use('/api/property/sell', [propertySellRouter.addSellProperty, propertySellRouter.removeSellProperty, propertySellRouter.updateSellProperty, propertySellRouter.getSellProperty]);
app.use('/api/project', [projectRouter.addProject, projectRouter.updateProject, projectRouter.getProject, projectRouter.removeProject]);
app.use('/api/project/type', [projectTypeRouter.addProjectType, projectTypeRouter.updateProjectType, projectTypeRouter.getProjectType, projectTypeRouter.removeProjectType]);
app.use('/api/assessment/expend/type', [expendetureTypeRouter.addExpendType, expendetureTypeRouter.removeExpendType, expendetureTypeRouter.updateExpendType, expendetureTypeRouter.getExpendType]);
app.use('/api/assessment/expend', [expendetureRouter.addExpend, expendetureRouter.removeExpend, expendetureRouter.updateExpend, expendetureRouter.getExpend]);
app.use('/api/assessment/income/type', [incomeTypeRouter.addIncomeType, incomeTypeRouter.removeIncomeType, incomeTypeRouter.updateIncomeType, incomeTypeRouter.getIncomeType]);
app.use('/api/assessment/income', [incomeRouter.addIncome, incomeRouter.removeIncome, incomeRouter.updateIncome, incomeRouter.getIncome]);

// Website Routes
app.use('/', [authSiteRouter.loginAuth, authSiteRouter.registerAuth, authSiteRouter.forgotAuth, authSiteRouter.resetAuth])
app.use('/dashboard', [dashboardRouter.homeRoute])
app.use('/dashboard/project', [projectAdminRouter.addProjectRoute, projectAdminRouter.updateProjectRoute, projectAdminRouter.projectListRoute, projectAdminRouter.projectTypeRoute])
app.use('/dashboard/property', [propertyAdminRouter.addPropertyRoute, propertyAdminRouter.updatePropertyRoute, propertyAdminRouter.propertyListRoute, propertyAdminRouter.propertyTypeRoute])
app.use('/dashboard/progress', [progressAdminRouter.addProgressRoute, progressAdminRouter.progressListRoute])
app.use('/dashboard/partition', [partitionAdminRouter.addPartitionRoute, partitionAdminRouter.partitionListRoute, partitionAdminRouter.partitionTypeRoute, partitionAdminRouter.updatePartitionRoute])
app.use('/dashboard/sell', [propertySellAdminRouter.addPropertySellRoute, propertySellAdminRouter.propertySellListRoute])
app.use('/dashboard/payment', [propertyPaymentAdminRouter.addPropertyPaymentRoute, propertyPaymentAdminRouter.propertyPaymentListRoute])
app.use('/dashboard/admin', [userAdminRouter.addAdminRoute, userAdminRouter.adminListRoute, userAdminRouter.roleAdminRoute, userAdminRouter.updateAdminRoute])
app.use('/dashboard/assessment', [assessmentAdminRouter.incomeTypeRoute, assessmentAdminRouter.expendTypeRoute, assessmentAdminRouter.expendRoute, assessmentAdminRouter.incomeRoute])


app.use(function(req, res, next){
  res.status(404);
  const scripts = [
    '/assets/bundles/libscripts.bundle.js',
    '/assets/bundles/vendorscripts.bundle.js',
    '/assets/js/auth/common.js',
  ]
  const styles = [
    '/assets/css/main.css',
    '/assets/css/authentication.css',
    '/assets/css/color_skins.css',
  ]

  res.render('pages/auth/error/404', {
    scripts: scripts,
    styles: styles,
    host: config.get('hostname')
  });
});

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
