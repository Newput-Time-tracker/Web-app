/* global app: false */

app.controller('logoutController', ['$rootScope', '$scope', 'UserService', '$location',
function($rootScope, $scope, UserService, $location) {
  $scope.logout = function() {
    var status = UserService.endSession();
    if (status) {
      $rootScope.userName = '';
      $rootScope.userStatus = false;
      $location.path('/login');
    }
  };
}]);
