/* global app: false */

app.controller('DatePickrCntrl', ['$scope', function($scope) {
  $scope.datepickers = {
    dt: false,
    dtSecond: false
  };
  $scope.dateOptions = {
    showWeeks: false
  };
  $scope.open = function($event, which) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.datepickers[which] = true;
  };
}]);
