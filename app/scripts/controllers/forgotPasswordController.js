/* global app: false */

app.controller('forgotPasswordController', ['$scope', 'CONFIG', '$location', '$timeout', 'UserService',
function($scope, CONFIG, $location, $timeout, UserService) {
  this.fetchPwd = function() {
    var email = $scope.email;
    var dataPromise = UserService.forgotPassword(email);
    dataPromise.then(function(response) {
      if (response.success) {
        $scope.successMessage = "Reset password link has been sent to the mail id";
      }else {
        $scope.errorMessage = "Invalid Email";
      }
    }, function() {
      $scope.errorMessage = "Server is down for maintainance please wait!";
      $scope.successMessage = '';
    });
    $timeout(function() {
      $scope.errorMessage = '';
      $scope.successMessage = '';
    }, CONFIG.FADE_OUT);
  };
  this.resetPassword = function() {
    $scope.param = $location.search();
    $scope.resetpwd.empId = $scope.param.ID;
    $scope.resetpwd.pToken = $scope.param.PT;
    var dataPromise = UserService.resetPassword($scope.resetpwd);
    dataPromise.then(function(response) {
      if (response.success) {
        $scope.successMessage = "Password Changed Successfully!";
        $timeout(function() {
          $location.path('/login');
        }, CONFIG.REDIRECT_TIMEOUT);
      } else {
        $scope.errorMessage = response.error;
      }
    }, function() {
      $scope.errorMessage = "Server is down For maintainance please wait!";
    });
  };
}]);
