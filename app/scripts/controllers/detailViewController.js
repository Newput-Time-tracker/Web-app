/* global moment: false */
/* global app: false */

app.controller('detailViewController', ['$scope', '$location', '$rootScope', '$timeout', '$routeParams', 'UserService',
function($scope, $location, $rootScope, $timeout, $routeParams, UserService) {
  $scope.errorMessage = null;
  $scope.timesheet = {};
  // calculate total minutes of day work
  var getWorkDayHours = function(timeIn, timeOut) {
    var timeInarray = timeIn.toString().split(":");
    var minutes = 60;
    var minutesFirst = parseInt(timeInarray[0], 10) * minutes;
    var totalFirstMin = parseInt(minutesFirst, 10) + parseInt(timeInarray[1], 10);

    var timeOutarray = timeOut.toString().split(":");
    var minutesSecond = parseInt(timeOutarray[0], 10) * minutes;
    var totalSecondMin = parseInt(minutesSecond, 10) + parseInt(timeOutarray[1], 10);

    if (parseInt(totalSecondMin, 10) < parseInt(totalFirstMin, 10)) {
      $scope.errorMessage = "End Time should be greater than Start Time!";
      // return;
    }
    var totalTimeInMinutes = parseInt(totalSecondMin, 10) - parseInt(totalFirstMin, 10);
    return totalTimeInMinutes;
  };

  var checkData = function(timesheet) {
    if ((timesheet.in && timesheet.out) ||
      (timesheet.lunchIn && timesheet.luncOut) ||
     (timesheet.nightIn && timesheet.nightOut)) {
      return true;
    }else {
      return false;
    }
  };
  var checkBlank = function(timesheet) {
    if ((timesheet.in == '00:00' && timesheet.out == '00:00') &&
     (timesheet.lunchIn == '00:00' && timesheet.luncOut == '00:00') &&
     (timesheet.nightIn == '00:00' && timesheet.nightOut == '00:00')) {
      return true;
    }else {
      return false;
    }
  };

  // save timesheet entry
  this.saveTimesheet = function() {
    var flag = checkData($scope.timesheet);
    if ($scope.timesheet == null || !flag) {
      $scope.errorMessage = "Time fields Can't leave blank!!";
      return;
    }else if (checkBlank($scope.timesheet)) {
      $scope.errorMessage = "Time fields Can't leave blank!!";
      return;
    }
    // totalworkingHour = $scope.getTotoalhours($scope.timesheet);
    if ($scope.errorMessage == null) {
      var dataPromise = UserService.saveDetailTimeSheet($scope.timesheet, $scope.date);
      dataPromise.then(function(response) {
        if (response.success) {
          $scope.successMessage = "Successfully Saved!";
        }else {
          $scope.errorMessage = "Sorry ! You can fill data only for current week.";
        }
      }, function() {
        $scope.errorMessage = "Something wrong on Server Please wait !";
      });
    }
  };
  // calculate hours and minutes of day work
  var dayWork = function(dayTime, lunchTime, nightTime) {
    var reminDayTime = parseFloat(dayTime) - parseFloat(lunchTime);
    var totalWorkMinutes = parseFloat(reminDayTime) + parseFloat(nightTime);
    var minute = 60;
    var hours = parseInt(Math.floor(parseInt(totalWorkMinutes, 10)) / minute, 10);
    var minutes = parseInt(totalWorkMinutes, 10) % minute;
    $scope.totalHour = hours + "." + minutes;
    return $scope.totalHour;
  };
  // calculate total hours
  $scope.getTotalhours = function() {
    $scope.dayWork = null;
    $scope.resetMessage();
    var dayTime = 0;
    var lunchTime = 0;
    var nightTime = 0;
    if (isNaN($scope.timesheet.in) && isNaN($scope.timesheet.out) &&
      $scope.timesheet.in != null && $scope.timesheet.out != null) {
      dayTime = getWorkDayHours($scope.timesheet.in, $scope.timesheet.out);
    }
    if (isNaN($scope.timesheet.lunchIn) && isNaN($scope.timesheet.lunchOut) &&
      $scope.timesheet.lunchIn != null && $scope.timesheet.lunchOut != null) {
      lunchTime = getWorkDayHours($scope.timesheet.lunchIn, $scope.timesheet.lunchOut);
    }
    if (isNaN($scope.timesheet.nightIn) && isNaN($scope.timesheet.nightOut) &&
      $scope.timesheet.nightIn != null && $scope.timesheet.nightOut != null) {
      nightTime = getWorkDayHours($scope.timesheet.nightIn, $scope.timesheet.nightOut);
    }
    $scope.isInvalid($scope.timesheet.in, $scope.timesheet.out);
    $scope.isInvalid($scope.timesheet.lunchIn, $scope.timesheet.lunchOut);
    $scope.isInvalid($scope.timesheet.nightIn, $scope.timesheet.nightOut);

    dayWork(dayTime, lunchTime, nightTime);
  };
  // check valid time format
  $scope.isInvalid = function(timeIn, timeOut) {
    if ((timeIn != null && timeOut == null) || (timeIn == null && timeOut != null) ||
     (timeIn === "" && timeOut != "") || (timeOut === "" && timeIn != "")) {
      $scope.errorMessage = "Please insert valid time format";
      return;
    }
  };
  // initialize method use when some one call detail url direct form browser or edit any existing record
  var init = function() {
    $scope.date = $routeParams.date;
    var newDate = moment($scope.date, ["DD-MM-YYYY"]);
    var month = newDate.month();
    var year = newDate.year();
    var curDate = new Date();
    var curMonth = curDate.getMonth();
    var curYear = curDate.getFullYear();
    $scope.isReadonly = true;
    if ((month == curMonth) && (year == curYear)) {
      $scope.isReadonly = false;
    }
    if ($rootScope.detailTimesheetByIndex) {
      var monthlyDetailTimeSheet = $rootScope.detailTimesheetByIndex;
      if (monthlyDetailTimeSheet[$scope.date]) {
        $scope.timesheet.workDate = $scope.date;
        $scope.timesheet = monthlyDetailTimeSheet[$scope.date];
        $scope.totalHour = $scope.timesheet.totalHour;
      }
    }else {
      var dataPromise = UserService.getDayData($scope.date);
      dataPromise.then(function(response) {
        if (response.success) {
          $scope.timesheet = response.data[0];
          $scope.totalHour = $scope.timesheet.totalHour;
        }else {
          $scope.errorMessage = response.error;
        }
      }, function() {
        $scope.errorMessage = "Something wrong on Server Please wait !";
      });
    }
  };
  init();
  $scope.reset = function() {
    $scope.timesheet = null;
    $scope.dayWork = null;
    $scope.totalHour = null;
    $scope.resetMessage();
    $scope.detailview.$setPristine();
    $scope.detailview.$setUntouched();
  };

  $scope.resetMessage = function() {
    $scope.errorMessage = null;
    $scope.successMessage = null;
  };
}]);
