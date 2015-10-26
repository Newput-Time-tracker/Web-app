app.controller('loginController', ['$scope', '$location', 'UserService',
function($scope, $location, userService) {
  this.verifyUser = function() {
    var employeesPromise = userService.authUser($scope.user);
    userService.setAccessToken();
    // set access token
    // below code not in use until api is not available (testing purpose).
    // employeesPromise.then(function(res){
    // $scope.employees = res;
    // }, function(error){
    // console.log(error);s
    // });
    $location.path('/usertimesheet');
  };
  this.toLocation = function(loc) {
    $location.path('/' + loc);
  };
}]);

