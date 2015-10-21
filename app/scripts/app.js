var app = angular.module('myApp', ['ngRoute']);
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
	$routeProvider.
	when('/', {
		templateUrl: 'views/_login.html',
		controller: 'loginController',
		controllerAs:'login'
	}).
	when('/forgetpassword', {
		templateUrl: 'views/_forgotpassword.html',
		controller: 'forgotPasswordController',
	  controllerAs:'forgotPwd'
	}).
	when('/signup' ,{
		templateUrl: 'views/_signup.html',
		controller: 'signUpController',
		controllerAs: 'signUp'
  	}).
	when('/detailview' ,{
		 templateUrl: 'views/_detailview.html',
	     controller: 'detailViewController',
		 controllerAs: 'detail'
	}).
	otherwise({redirectTo: '/'});
	$locationProvider.html5Mode(true);
}]);

 app.directive('pwCheck', function() {
  return {
    require: 'ngModel',
    scope: {
      otherModelValue: '=pwCheck'
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