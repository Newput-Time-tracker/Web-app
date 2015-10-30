app.controller('forgotPasswordController', ['$scope', '$location', '$timeout', 'UserService',
function($scope, $location, $timeout, UserService) {
  this.fetchPwd = function() {
    var dataPromise = UserService.forgotPassword($scope.email);
    dataPromise.then(function(response) {
     if(response.success) {
       $scope.successMessage = "Password recover link successfully sent on mail!";
     }
     else {
       $scope.errorMessage = response.error;
     }
    }, function(error) {
      $scope.errorMessage = "Server is down for maintainance please wait!";
    });
  };
  this.resetPassword = function() {
    $scope.param = $location.search();
    //$scope.resetpwd.empId = $scope.param.ID;
   // $scope.resetpwd.pToken = $scope.param.PT;
    var dataPromise = UserService.resetPassword($scope.resetpwd);
    dataPromise.then(function(response) {
     if(response.success) {
       $scope.successMessage = "Password Changed Successfully!";
       $timeout(function(){
       $location.path('/login');
       },3000);
     }
     else {
       $scope.errorMessage = response.error;
     }
    }, function(error) {
      $scope.errorMessage = "Server is down For maintainance please wait!";
    });
  };
}]);
