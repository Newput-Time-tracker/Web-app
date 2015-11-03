 //global constants
var ENV_TYPES = { PRODUCTION: 'production', DEVELOPMENT: 'development', STAGING: 'staging' };

var app = angular.module('myApp', ['ngRoute', 'ui.bootstrap', 'ngMask', 'ngCookies']);

// app level constants
app.constant('CONFIG', {
  APP_NAME: 'Time tracker',
  VERSION: '0.0.1',
  API_URL: 'http://tt-rahul-backend.herokuapp.com/Tracker/rest/employee',
  SESSION_COOKIE: {
    NAME: 'TT_SESSION',
    EXPIRY: 365 // in days
  },
  ENV: ENV_TYPES.PRODUCTION
});

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  var viewsDir = 'views/';

  // enable HTML5 mode
  $locationProvider.html5Mode(true);

  $routeProvider.when('/login', {
    templateUrl : viewsDir + '_login.html',
    controller : 'loginController',
    controllerAs : 'login'
  })
  .when('/forgetpassword', {
    templateUrl : viewsDir + '_forgotpassword.html',
    controller : 'forgotPasswordController',
    controllerAs : 'forgotPwd'
  })
  .when('/signup', {
    templateUrl : viewsDir + '_signup.html',
    controller : 'signUpController',
    controllerAs : 'signUp'
  })
  .when('/detailview/:date', {
    templateUrl : viewsDir + '_detailview.html',
    controller : 'detailViewController',
    controllerAs : 'detail'
  })
  .when('/usertimesheet', {
    templateUrl : viewsDir + '_usertimesheet.html',
    controller : 'userTimesheetController',
    controllerAs : 'timesheet'
  })
  .when('/verifyuser', {
    templateUrl : viewsDir + '_verifyuser.html',
    controller : 'verifyUserController',
    controllerAs : 'verify'
  })
  .when('/resetpassword', {
      templateUrl: viewsDir + '_resetpassword.html',
      controller: 'forgotPasswordController',
      controllerAs: 'forgotPwd'
    })
  .otherwise({
    redirectTo : '/login'
  });
}]);
