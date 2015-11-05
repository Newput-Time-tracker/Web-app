/* global app: false */

app.controller('verifyUserController', ['$scope', '$location', '$timeout', 'AuthService',
function($scope, $location, $timeout, AuthService) {
  this.verifyUser = function() {
    $scope.verifyUser = $location.search();
    var dataPromise = AuthService.verifyUser($scope.verifyUser);
    dataPromise.then(function(response) {
      if (response.success) {
        var number = 2000;
        $scope.successMessage = "Verify Successfully!";
        $timeout(function() {
          $location.path('/login');
        }, number);
      } else {
        $scope.errorMessage = "Email id or token is not correct.";
      }
    }, function() {
      $scope.errorMessage = "Server will up in few minutes Please wait";
    });
  };
}]);
