/* global angular: false */
// global constants
var ENV_TYPES = { PRODUCTION: 'production', DEVELOPMENT: 'development', STAGING: 'staging' };

var app = angular.module('myApp', ['ngRoute', 'ui.bootstrap', 'ngMask', 'ngCookies']);

// app level constants
app.constant('CONFIG', {
  APP_NAME: 'Time tracker',
  VERSION: '0.0.1',
  API_URL: 'http://time-tracker-backend-app.herokuapp.com/Tracker/rest/employee',
  SESSION_COOKIE: {
    NAME: 'TT_SESSION',
    EXPIRY: 365 // in days
  },
  ENV: ENV_TYPES.PRODUCTION,
  WEEK_DAYS: 7,
  MOD: 10,
  MIN_PER_HOUR: 60,
  RD_SUFFIX: 3,
  ST_SUFFIX: 1,
  ND_SUFFIX: 2,
  CLOSE_MODAL_BOX: 2000,
  START_OF_THE_WEEK: 1,
  END_OF_THE_WEEK: 7,
  MIN_AGE: 18,
  REDIRECT_TIMEOUT: 2000,
  FADE_OUT: 5000
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
  .when('/detailview/:date', {
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

app.run(['$rootScope', '$location', '$cookies', 'AuthService', 'CONFIG', function($rootScope, $location, $cookies, AuthService, CONFIG) {
  // Check the authentication required url and navigate to login
  $rootScope.$on("$routeChangeStart", function(event, nextRoute) {
    if (nextRoute != null && nextRoute.access != null && nextRoute.access.requiredAuthentication) {
      var user = AuthService.getUser();
      if (!(user && user['token'])) {
        var date = nextRoute.params.date;
        var path = nextRoute.originalPath.replace('/:date', '');
        var url = {'redirectUrl': path + '/' + date};
        var now = new Date();
        now.setDate(now.getDate() + CONFIG.WEEK_DAYS);
        $cookies.put('tt_globals', JSON.stringify(url), {expiry: now});
        $location.path("/login");
      }
    }
  });
}]);
