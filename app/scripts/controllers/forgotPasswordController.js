/* global app: false */

app.controller('forgotPasswordController', ['$scope', '$location', '$timeout', 'UserService',
function($scope, $location, $timeout, UserService) {
  this.fetchPwd = function() {
    var email = $scope.email;
    var dataPromise = UserService.forgotPassword(email);
    dataPromise.then(function(response) {
      if (response.success) {
        $scope.successMessage = "Password recover link successfully sent on mail!";
      } else {
        $scope.errorMessage = "Invalid Email";
      }
    }, function() {
      $scope.errorMessage = "Server is down for maintainance please wait!";
    });
  };
  this.resetPassword = function() {
    $scope.param = $location.search();
    $scope.resetpwd.empId = $scope.param.ID;
    $scope.resetpwd.pToken = $scope.param.PT;
    var dataPromise = UserService.resetPassword($scope.resetpwd);
    dataPromise.then(function(response) {
      var REDIRECT_TIMEOUT = 3000;
      if (response.success) {
        $scope.successMessage = "Password Changed Successfully!";
        $timeout(function() {
          $location.path('/login');
        }, REDIRECT_TIMEOUT);
      } else {
        $scope.errorMessage = response.error;
      }
    }, function() {
      $scope.errorMessage = "Server is down For maintainance please wait!";
    });
  };
}]);
