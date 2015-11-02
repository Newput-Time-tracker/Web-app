app.controller('verifyUserController', ['$scope', '$location', '$timeout', 'AuthService',
function($scope, $location, $timeout, AuthService) {

  verifyUser = function() {
    $scope.verifyUser = $location.search();

  var dataPromise = AuthService.verifyUser($scope.verifyUser);
    dataPromise.then(function(response) {
      if(response.success){
        $scope.successMessage = "Verify Successfully!";
        $timeout(function() {
          $location.path('/login');
        },2000);
      }
      else {
         $scope.errorMessage = "Please make sure the correct Email";
      }
    }, function(error) {
      $scope.errorMessage  = "Server will up in few minutes Please wait";;
    });
  };

  verifyUser();
  resetMessage =function() {
    $scope.errorMessage = null;
  };
  resetMessage();
}]);
