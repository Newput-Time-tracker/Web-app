app.controller('loginController', ['$scope', '$location', '$cookies', 'UserService', 'AuthService',
function($scope, $location, $cookies, UserService, AuthService) {
  // check cookie exist or not
  var cookieObj = AuthService.getAccessToken();
  if(cookieObj) {
    $location.path('/usertimesheet');
  }
  this.loginUser = function() {
    var employeesPromise = UserService.authUser($scope.user);
    employeesPromise.then(function(res){
      if (res.success) {
        var tt_globals = $cookies.get('tt_globals');
        if(tt_globals) {
          var path = JSON.parse(tt_globals);
          $location.path(path.redirectUrl);
          AuthService.clearUrlTracker();
        }else {
        $location.path("usertimesheet");
        }
      } else {
        $scope.errorMessage = "Invalid Credential or May be you didn't SignUP " ;
      }
    }, function(error){
      $scope.errorMessage = 'Something is went wrong !' ;
    });
  };
  this.toLocation = function(loc) {
    $location.path('/' + loc);
  };
}]);
