/* global angular: false */
/* eslint guard-for-in: 1 */
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
  CLOSE_MODAL_BOX: 3000,
  START_OF_THE_WEEK: 1,
  END_OF_THE_WEEK: 7,
  MIN_AGE: 18,
  REDIRECT_TIMEOUT: 2000,
  FADE_OUT: 5000,
  CONVERT_MINUTES: 330,
  MAX_LENGTH: 45,
  MISSING_PARAMETER: 400,
  UNAUTHORIZE_ACCESS: 401,
  TRIM_CHARACTERS: 3
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

app.run(['$rootScope', 'UserService', '$location', '$cookies', 'AuthService', 'CONFIG',
function($rootScope, UserService, $location, $cookies, AuthService, CONFIG) {
  // check response status;
  $rootScope.$on('authFailure', function() {
    var status = UserService.endSession();
    if (status) {
      $rootScope.userName = '';
      $rootScope.userStatus = false;
      $location.path('/login');
    }
    return;
  });

  var prepareRoute = function(routeObj) {
    var route = routeObj.originalPath;
    for (var key in routeObj['pathParams']) {
      if (routeObj['pathParams'].hasOwnProperty(key)) {
        route = route.replace(':' + key, routeObj['pathParams'][key]);
      }
    }
    return route;
  };
  // Check the authentication required url and navigate to login
  $rootScope.$on("$routeChangeStart", function(event, nextRoute) {
    if (nextRoute != null && nextRoute.access != null && nextRoute.access.requiredAuthentication) {
      var user = AuthService.getAccessToken();
      $rootScope.userName = '';
      $rootScope.userStatus = false;
      if (!(user && user['token'])) {
        var url = {'redirectUrl': prepareRoute(nextRoute)};
        var now = new Date();
        now.setDate(now.getDate() + CONFIG.WEEK_DAYS);
        $cookies.put('tt_globals', JSON.stringify(url), {expiry: now});
        $rootScope.userStatus = false;
        $location.path("/login");
      } else {
        $location.path(prepareRoute(nextRoute));
        $rootScope.userName = user['userObj'].firstName;
        $rootScope.userStatus = true;
      }
    }
  });
}]);
