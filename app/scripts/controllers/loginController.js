app.controller('loginController', ['$scope', '$location', 'UserService',
function($scope, $location, UserService) {
  this.verifyUser = function() {
    var employeesPromise = UserService.authUser($scope.user);
    UserService.setAccessToken();
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
