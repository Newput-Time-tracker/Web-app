/* global angular: false */

// global constants
var ENV_TYPES = { PRODUCTION: 'production', DEVELOPMENT: 'development', STAGING: 'staging' };

var app = angular.module('myApp', ['ngRoute', 'ui.bootstrap', 'ngMask', 'ngCookies']);

// app level constants
app.constant('CONFIG', {
  APP_NAME: 'Time tracker',
  VERSION: '0.0.1',
  API_URL: 'http://time-tracker-backend-app.com/Tracker/rest/employee',
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
    templateUrl: viewsDir + '_login.html',
    controller: 'loginController',
    controllerAs: 'login'
  })
  .when('/forgetpassword', {
    templateUrl: viewsDir + '_forgotpassword.html',
    controller: 'forgotPasswordController',
    controllerAs: 'forgotPwd'
  })
  .when('/signup', {
    templateUrl: viewsDir + '_signup.html',
    controller: 'signUpController',
    controllerAs: 'signUp'
  })
  .when('/detailview', {
    templateUrl: viewsDir + '_detailview.html',
    controller: 'detailViewController',
    controllerAs: 'detail',
    access: { requiredAuthentication: true }
  })
  .when('/usertimesheet', {
    templateUrl: viewsDir + '_usertimesheet.html',
    controller: 'userTimesheetController',
    controllerAs: 'timesheet',
    access: { requiredAuthentication: true }
  })
  .when('/verifyuser', {
    templateUrl: viewsDir + '_verifyuser.html',
    controller: 'verifyUserController',
    controllerAs: 'verify'
  })
  .when('/resetpassword', {
    templateUrl: viewsDir + '_resetpassword.html',
    controller: 'forgotPasswordController',
    controllerAs: 'forgotPwd'
  })
  .otherwise({
    redirectTo: '/login'
  });
}]);

app.run(function($rootScope, $location, $cookies, AuthService) {
  $rootScope.$on("$routeChangeStart", function(event, nextRoute) {
    if (nextRoute != null && nextRoute.access != null && nextRoute.access.requiredAuthentication) {
      var user = AuthService.getUser();
      if (!(user && user['token'])) {
        // TODO: set expiry porperly
        var date = nextRoute.params.date;
        var path = nextRoute.originalPath.replace('/:date', '');
        var url = {'redirectUrl': path + '/' + date};
        $cookies.put('tt_globals', JSON.stringify(url));
        $location.path("/login");
      }
    }
  });
});
