/* global moment: false */
/* global app: false */

app.controller('detailViewController', ['$scope', '$location', '$rootScope', '$timeout', '$routeParams', 'UserService',
function($scope, $location, $rootScope, $timeout, $routeParams, UserService) {
  $scope.errorMessage = null;
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

  this.saveTimesheet = function() {
    if ($scope.timesheet == null) {
      $scope.errorMessage = "Time fields Can't leave blank!!";
      return;
    }
    // totalworkingHour = $scope.getTotoalhours($scope.timesheet);
    if ($scope.errorMessage == null) {
      var dataPromise = UserService.saveDetailTimeSheet($scope.timesheet, $scope.date);
      dataPromise.then(function(response) {
        var REDIRECT_TIMEOUT = 3000;
        if (response.success) {
          $scope.successMessage = "Successfully Saved!";
          $timeout(function() {
            $location.path("/usertimesheet");
          }, REDIRECT_TIMEOUT);
        }else {
          $scope.errorMessage = "Invalid Entry! Please make sure the correct format";
        }
      }, function() {
        $scope.errorMessage = "Something wrong on Server Please wait !";
      });
    }
  };
  var dayWork = function(dayTime, lunchTime, nightTime) {
    var reminDayTime = parseFloat(dayTime) - parseFloat(lunchTime);
    var totalWorkMinutes = parseFloat(reminDayTime) + parseFloat(nightTime);
    var minute = 60;
    var hours = parseInt(Math.floor(parseInt(totalWorkMinutes, 10)) / minute, 10);
    var minutes = parseInt(totalWorkMinutes, 10) % minute;
    $scope.dayWork = hours + "." + minutes;
    return $scope.dayWork;
  };
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

  $scope.isInvalid = function(timeIn, timeOut) {
    if ((timeIn != null && timeOut == null) || (timeIn == null && timeOut != null) ||
     (timeIn === "" && timeOut != "") || (timeOut === "" && timeIn != "")) {
      $scope.errorMessage = "Please insert valid time format";
      return;
    }
  };

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
      }
    }else {
      var dataPromise = UserService.getDayData($scope.date);
      dataPromise.then(function(response) {
        if (response.success) {
          $scope.timesheet = response.data;
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
  };

  $scope.resetMessage = function() {
    $scope.errorMessage = null;
  };
}]);
