app.controller('detailViewController', ['$scope', '$location', '$rootScope', '$timeout', '$routeParams', 'UserService',
function($scope, $location, $rootScope, $timeout, $routeParams, UserService)  {
  $scope.errorMessage = null;
  var getWorkDayHours = function(timeIn, timeOut) {
    var timeInarray = timeIn.toString().split(":");
    var minutesFirst = parseInt(timeInarray[0]) * 60;
    var totalFirstMin = parseInt(minutesFirst) + parseInt(timeInarray[1]);

    var timeOutarray = timeOut.toString().split(":");
    var minutesSecond = parseInt(timeOutarray[0]) * 60;
    var totalSecondMin = parseInt(minutesSecond) + parseInt(timeOutarray[1]);

    if (parseInt(totalSecondMin) < parseInt(totalFirstMin)) {
      $scope.errorMessage = "End Time should be greater than Start Time!";
      return;
    }
    var totalTimeInMinutes = parseInt(totalSecondMin) - parseInt(totalFirstMin);
    return totalTimeInMinutes;
  };

  this.saveTimesheet = function(timesheet) {
    if ($scope.timesheet == undefined) {
      $scope.errorMessage = "Time fields Can't leave blank!!";
      return;
    }
    //totalworkingHour = $scope.getTotoalhours($scope.timesheet);
    if($scope.errorMessage==null) {
      var dataPromise = UserService.saveDetailTimeSheet($scope.timesheet, $scope.date);
      dataPromise.then(function(response) {
        if(response.success) {
          $scope.successMessage = "Successfully Saved!";
          $timeout( function() {
            $location.path("/usertimesheet");
          }, 3000);
        }else {
          $scope.errorMessage = "Invalid Entry! Please make sure the correct format";
        }
      }, function(error) {
        $scope.errorMessage = "Something wrong on Server Please wait !";
      });
    }
  };

  $scope.getTotalhours = function(timesheet) {
    $scope.dayWork = null;
    $scope.resetMessage();
    var dayTime = lunchTime = nightTime = 0;
    if (isNaN($scope.timesheet.in) && isNaN($scope.timesheet.out) && $scope.timesheet.in != undefined && $scope.timesheet.out != undefined) {
      dayTime = getWorkDayHours($scope.timesheet.in, $scope.timesheet.out);
    }
    if (isNaN($scope.timesheet.lunchIn) && isNaN($scope.timesheet.lunchOut) && $scope.timesheet.lunchIn != undefined && $scope.timesheet.lunchOut != undefined) {
      lunchTime = getWorkDayHours($scope.timesheet.lunchIn, $scope.timesheet.lunchOut);
    }
    if (isNaN($scope.timesheet.nightIn) && isNaN($scope.timesheet.nightOut) && $scope.timesheet.nightIn != undefined && $scope.timesheet.nightOut != undefined) {
      nightTime = getWorkDayHours($scope.timesheet.nightIn, $scope.timesheet.nightOut);
    }
    $scope.isInvalid($scope.timesheet.in, $scope.timesheet.out);
    $scope.isInvalid($scope.timesheet.lunchIn, $scope.timesheet.lunchOut);
    $scope.isInvalid($scope.timesheet.nightIn, $scope.timesheet.nightOut);

    dayWork(dayTime, lunchTime, nightTime);
  };
  dayWork = function(dayTime, lunchTime, nightTime) {
    var reminDayTime = parseFloat(dayTime) - parseFloat(lunchTime);
    var totalWorkMinutes = parseFloat(reminDayTime) + parseFloat(nightTime);
    var hours = parseInt(Math.floor(parseInt(totalWorkMinutes)) / 60);
    var minutes = parseInt(totalWorkMinutes) % 60;
    return $scope.dayWork = hours + "." + minutes;
  };
  $scope.isInvalid = function(timeIn, timeOut) {
    if ((timeIn != undefined && timeOut == undefined) || (timeIn == undefined && timeOut != undefined) || (timeIn === "" && timeOut != "") || (timeOut === "" && timeIn != ""))
      $scope.errorMessage = "Please insert valid time format";
      return;
  };


  init = function() {
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
    var monthlyDetailTimeSheet = $rootScope.detailTimesheetByIndex;
    if (monthlyDetailTimeSheet[$scope.date]) {
      //$scope.timesheet.workDate = date;
      $scope.timesheet = monthlyDetailTimeSheet[$scope.date];
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
