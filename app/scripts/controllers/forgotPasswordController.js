/* global app: false */

app.controller('forgotPasswordController', ['$scope', 'CONFIG', '$location', '$timeout', 'UserService',
function($scope, CONFIG, $location, $timeout, UserService) {
  this.fetchPwd = function() {
    $('#submit-btn').text('Please wait...').attr('disabled', 'disabled');
    var email = $scope.email;
    var dataPromise = UserService.forgotPassword(email);
    dataPromise.then(function(response) {
      if (response.success) {
        $scope.successMessage = "Reset password link has been sent to the mail id";
        $('#submit-btn').text('Retrieve').removeAttr("disabled");
      }else {
        $scope.errorMessage = "Invalid Email";
        $('#submit-btn').text('Retrieve').removeAttr("disabled");
      }
    }, function() {
      $scope.errorMessage = "Server is down for maintainance please wait!";
      $scope.successMessage = '';
      $('#submit-btn').text('Retrieve').removeAttr("disabled");
    });
    $timeout(function() {
      $scope.errorMessage = '';
      $scope.successMessage = '';
    }, CONFIG.FADE_OUT);
  };
  this.resetPassword = function() {
    $('#submit-btn').text('Please wait...').attr('disabled', 'disabled');
    $scope.param = $location.search();
    $scope.resetpwd.empId = $scope.param.ID;
    $scope.resetpwd.pToken = $scope.param.PT;
    var dataPromise = UserService.resetPassword($scope.resetpwd);
    dataPromise.then(function(response) {
      if (response.success) {
        $scope.successMessage = "Password Changed Successfully!";
        $('#submit-btn').text('Sign In').removeAttr("disabled");
        $timeout(function() {
          $location.path('/login');
        }, CONFIG.REDIRECT_TIMEOUT);
      } else {
        $scope.errorMessage = response.error;
        $('#submit-btn').text('Sign In').removeAttr("disabled");
      }
    }, function() {
      $scope.errorMessage = "Server is down For maintainance please wait!";
      $('#submit-btn').text('Sign In').removeAttr("disabled");
    });
  };
}]);
