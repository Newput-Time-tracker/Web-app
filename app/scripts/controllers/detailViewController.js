app.controller('detailViewController', ['$scope', 'UserService', function($scope,UserService) {	
  $scope.errorMessage = null;
  var getWorkDayHours = function (timeIn, timeOut) {	
    var timeInarray = timeIn.toString().split(":");
    var minutesFirst = parseInt(timeInarray[0]) * 60;
    var totalFirstMin = parseInt(minutesFirst) + parseInt(timeInarray[1]);
    
    var timeOutarray = timeOut.toString().split(":");
    var minutesSecond = parseInt(timeOutarray[0]) * 60;
    var totalSecondMin = parseInt(minutesSecond) + parseInt(timeOutarray[1]);
    
    if(parseInt(totalSecondMin) < parseInt(totalFirstMin)) {
      $scope.errorMessage = "End Time should be greater than Start Time!";
      return;
    }
    var totalTimeInMinutes	= parseInt(totalSecondMin) - parseInt(totalFirstMin);
    return totalTimeInMinutes ;
  };
  	
  this.saveTimesheet = function(timesheet) {
    if($scope.timesheet == undefined){
      $scope.errorMessage = "Please insert valid time!";
      return;
    }
    //totalworkingHour = $scope.getTotoalhours($scope.timesheet);
    var dataPromise = UserService.saveDetailTimeSheet($scope.timesheet);
    dataPromise.then(function(response) {
      $scope.timesheet = response;
    },function(error) {
      $scope.errorMessage = error;
    });	
  };
  
  $scope.getTotoalhours = function(timesheet) {
    $scope.dayWork = null;
    $scope.resetMessage();
    var dayTime = lunchTime = nightTime = "0";
    if($scope.timesheet.in != undefined && $scope.timesheet.out != undefined) {	
      dayTime = getWorkDayHours($scope.timesheet.in,$scope.timesheet.out);				
    }
    if($scope.timesheet.lunchIn != undefined && $scope.timesheet.lunchOut != undefined) {
      lunchTime = getWorkDayHours($scope.timesheet.lunchIn,$scope.timesheet.lunchOut);
    }
    if($scope.timesheet.nightIn != undefined && $scope.timesheet.nightOut != undefined) {
      nightTime = getWorkDayHours($scope.timesheet.nightIn,$scope.timesheet.nightOut);
    }		
    $scope.isInvalid($scope.timesheet.in,$scope.timesheet.out);
    $scope.isInvalid($scope.timesheet.lunchIn,$scope.timesheet.lunchOut);
    $scope.isInvalid($scope.timesheet.nightIn,$scope.timesheet.nightOut);
    var reminDayTime = parseFloat(dayTime) - parseFloat(lunchTime);
    var totalWorkMinutes = parseFloat(reminDayTime) + parseFloat(nightTime);
    var hours = parseInt(Math.floor(parseInt(totalWorkMinutes)) / 60);          
    var minutes = parseInt(totalWorkMinutes) % 60;
    $scope.dayWork = hours + "." + minutes;
    return dayWork;
  };
  
  $scope.isInvalid = function(timeIn, timeOut) {
    if((timeIn != undefined && timeOut == undefined) || (timeIn == undefined && timeOut != undefined) )
    $scope.errorMessage = "Please insert valid time!";
  };
  	
  $scope.reset = function() { 
    $scope.timesheet = null;
  };
  
  $scope.resetMessage = function() { 
    $scope.errorMessage = null;
  };
  
}]);
