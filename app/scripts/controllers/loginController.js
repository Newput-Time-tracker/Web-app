app.controller('loginController', ['$scope', '$location', 'UserService',
function($scope, $location, UserService) {
  // check cookie exist or not
  var cookieObj = UserService.getAccessToken();
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
        }
        if ($scope.userObj != null && $scope.token!= null) {
            UserService.setAccessToken($scope.token, $scope.userObj);
           $location.path('/usertimesheet');
        }
      }
    }, function(error){
      console.log(error);
    });
  };
  this.toLocation = function(loc) {
    $location.path('/' + loc);
  };
}]);
