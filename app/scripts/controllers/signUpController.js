app.controller('signUpController', ['$scope', 'UserService',
function($scope, UserService) {
  $scope.errorMessage = null;
  this.userSignUp = function(user) {
    var userReg = $scope.user;
    var age = $scope.calculateAge(userReg.dob);
    if (age < 18) {
      $scope.errorMessage = "Opps ! Age should be 18 above you can't Register";
      return;
    }
    var dataPromise = UserService.registerUser($scope.user);
    dataPromise.then(function(response) {
      $scope.user = response;
    }, function(error) {
      $scope.errorMessage = error;
    });
    resetForm();
  };
  $scope.copareDate = function(user) {
    var dob = $scope.user.dob;
    var doj = $scope.user.doj;
    resetForm();
    if (new Date(dob) > new Date(doj)) {
      $scope.errorMessage = " Opps ! Date of Birth should be Less than Date of Joining";
      return;
    }
  };

  $scope.calculateAge = function(dob) {
    var dob = new Date(dob);
    var birth_year = dob.getFullYear();
    var birth_month = dob.getMonth();
    var birth_day = dob.getDate();

    today_date = new Date();
    today_year = today_date.getFullYear();
    today_month = today_date.getMonth();
    today_day = today_date.getDate();
    age = today_year - birth_year;

    if (today_month < (birth_month - 1)) {
      age--;
    }
    if (((birth_month - 1) == today_month) && (today_day < birth_day)) {
      age--;
    }
    return age;
  };

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.opened = true;
  };

  $scope.reset = function() {
    $scope.user = "";
  };
  $scope.reset();

  resetForm = function() {
    $scope.errorMessage = null;
  };

}]);
