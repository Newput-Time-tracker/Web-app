var app = angular.module('myApp', ['ngRoute', 'ui.bootstrap', 'ngMask', 'ngCookies']);

app.config(['$routeProvider', '$locationProvider','$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {

  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];


  $routeProvider.
    when('/login', {
      templateUrl: 'views/_login.html',
      controller: 'loginController',
      controllerAs: 'login'
    }).
    when('/forgetpassword', {
      templateUrl: 'views/_forgotpassword.html',
      controller: 'forgotPasswordController',
      controllerAs: 'forgotPwd'
    }).
    when('/signup' , {
      templateUrl: 'views/_signup.html',
      controller: 'signUpController',
      controllerAs: 'signUp'
    }).
    when('/detailview' , {
      templateUrl: 'views/_detailview.html',
      controller: 'detailViewController',
      controllerAs: 'detail'
    }).
    when('/usertimesheet', {
      templateUrl: 'views/_usertimesheet.html',
      controller: 'userTimesheetController',
      controllerAs: 'timesheet'
    }).
    when('/verifyuser', {
      templateUrl: 'views/_verifyuser.html',
      controller: 'verifyUserController',
      controllerAs: 'verify'
    }).
    otherwise({redirectTo: '/login'});

    $locationProvider.html5Mode(true);
}]);

app.constant('appSettings', {
  /*--------- localhost ---------------*/
  SERVER_BASE_URL: 'http://tt-rahul-backend.herokuapp.com/Tracker/rest/employee',
  //SERVER_BASE_URL: 'http://time-tracker-backend-app.herokuapp.com/Tracker/rest/employee',
  EXPIRY_TIME : 365


});

app.directive('pwCheck', function() {
  return {
    require: 'ngModel',
    scope: {
      otherModelValue: '= pwCheck'
    },
    link: function(scope, element, attributes, ngModel) {
      ngModel.$validators.pwCheck = function(modelValue) {
        return modelValue == scope.otherModelValue;
      };

      scope.$watch('otherModelValue', function() {
        ngModel.$validate();
      });
    }
  };
});

