/* global app: false */

app.controller('verifyUserController', ['$scope', '$location', '$timeout', 'AuthService',
function($scope, $location, $timeout, AuthService) {
  this.verifyUser = function() {
    $scope.verifyUser = $location.search();
    var dataPromise = AuthService.verifyUser($scope.verifyUser);
    dataPromise.then(function(response) {
      if (response.success) {
        $scope.successMessage = "Verify Successfully!";
      } else {
        $scope.errorMessage = "You account is already verified";
      }
    }, function() {
      $scope.errorMessage = "Server will up in few minutes Please wait";
    });
  };
}]);
