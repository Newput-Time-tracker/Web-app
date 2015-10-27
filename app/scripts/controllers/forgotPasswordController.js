app.controller('forgotPasswordController', ['$scope', 'UserService',
function($scope, UserService) {
  this.fetchPwd = function() {
    var dataPromise = UserService.forgotPassword($scope.email);
    dataPromise.then(function(response) {
      $scope.email = response;
    }, function(error) {
      //$scope.status = error;
      $scope.errorMessage = error;
    });
  };
}]);
