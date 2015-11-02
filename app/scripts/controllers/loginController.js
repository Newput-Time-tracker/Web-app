app.controller('loginController', ['$scope', '$location', 'UserService', 'AuthService',
function($scope, $location, UserService, AuthService) {
  // check cookie exist or not
  var cookieObj = AuthService.getAccessToken();
  if(cookieObj) {
    $location.path('/usertimesheet');
  }
  this.verifyUser = function() {
    var employeesPromise = UserService.authUser($scope.user);
    employeesPromise.then(function(res){
      if (res.success) {
        var employees = res.data;
        if (employees.length > 1) {
          $scope.userObj = employees[0];
          $scope.token = employees[1];
          if ($scope.userObj != null && $scope.token!= null) {
            AuthService.setAccessToken($scope.token, $scope.userObj);
            $location.path('/usertimesheet');
          }
        }
      } else {
        $scope.errorMessage = res.error ;
      }
    }, function(error){
      $scope.errorMessage = 'Something is went wrong !' ;
    });
  };
  this.toLocation = function(loc) {
    $location.path('/' + loc);
  };
}]);
