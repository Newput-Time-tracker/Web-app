/* global app: false */

app.controller('loginController', ['$scope', '$location', '$cookies', 'UserService', 'AuthService',
function($scope, $location, $cookies, UserService, AuthService) {
  // check cookie exist or not
  var cookieObj = AuthService.getAccessToken();
  if (cookieObj) {
    $location.path('/usertimesheet');
  }
  this.loginUser = function() {
    var employeesPromise = UserService.authUser($scope.user);
    employeesPromise.then(function(res) {
      if (res.success) {
        var ttGlobals = $cookies.get('tt_globals');
        if (ttGlobals) {
          var path = JSON.parse(ttGlobals);
          $location.path(path.redirectUrl);
          AuthService.clearUrlTracker();
        } else {
          $location.path('usertimesheet');
        }
      } else {
        $scope.errorMessage = 'Looks like wrong email or password';
      }
    }, function() {
      $scope.errorMessage = 'Something went wrong, please try again!';
    });
  };
  this.toLocation = function(loc) {
    $location.path('/' + loc);
  };
}]);
