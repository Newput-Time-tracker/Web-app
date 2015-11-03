app.controller('signUpController', ['$scope', 'UserService',
function($scope, UserService) {
  $scope.errorMessage = null;
  var resetForm = function() {
    $scope.errorMessage = null;
  };
  this.userSignUp = function() {
    var userReg = $scope.user;
    var age = $scope.calculateAge(userReg.dob);
    var NUMBER = 18;
    if (age < NUMBER) {
      $scope.errorMessage = "Opps ! Age should be 18 above you can't Register";
      return;
    }
    var dataPromise = UserService.registerUser($scope.user);
    dataPromise.then(function(response) {
      if (response.success) {
        $scope.successMessage = "Registered Successfully !";
      }else {
        $scope.errorMessage = "Email id already exist!";
      }
    }, function() {
      $scope.errorMessage = "Something went wrong on server!";
    });
    resetForm();
  };
  $scope.copareDate = function() {
    var dob = $scope.user.dob;
    var doj = $scope.user.doj;
    resetForm();
    if (new Date(dob) > new Date(doj)) {
      $scope.errorMessage = " Opps ! Date of Birth should be Less than Date of Joining";
      return;
    }
  };

  $scope.calculateAge = function(dob) {
    var dateOfBirth = new Date(dob);
    var birthYear = dateOfBirth.getFullYear();
    var birthMonth = dateOfBirth.getMonth();
    var birthDay = dateOfBirth.getDate();

    var todayDate = new Date();
    var todayYear = todayDate.getFullYear();
    var todayMonth = todayDate.getMonth();
    var todayDay = todayDate.getDate();
    var age = todayYear - birthYear;

    if (todayMonth < (birthMonth - 1)) {
      age--;
    }
    if (((birthMonth - 1) == todayMonth) && (todayDay < birthDay)) {
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
}]);
