app.controller('detailViewController', ['$scope','userServices', function($scope,userServices){	
	$scope.errorMessage = null;
    var getWorkDayHours1 = function (timeIn, timeOut) {
		var timeIn= timeIn.split(":");
		var timeInFhour = timeIn[0];
		var timeInShour = timeIn[1]/60;	
		var timeInHours = parseFloat(timeInFhour)+parseFloat(timeInShour);
		//console.log(timeInHours);
		var timeOut= timeOut.split(":");
		var timeOutFhour = timeOut[0];			
		var timeOutShour = timeOut[1]/60;
		var timeOutHours = parseFloat(timeOutFhour)+parseFloat(timeOutShour);
		
		//console.log(timeOutHours);
		var totalTimeHours = parseFloat(timeOutHours)-parseFloat(timeInHours);
		
		//console.log("total==="+totalTimeHours);
		var str = totalTimeHours.toString();
		
		if(str.contains(".")) {
			var calHours = str.split(".");
			var hours = calHours[1];		  
			hours= "."+hours;
			var minutes = parseFloat(hours)*60;
			minutes= Math.round(minutes * 100) / 100;
			minutes =parseInt(minutes);
			console.log('containminutes===');
			console.log(calHours[0]+"."+minutes);
			return calHours[0]+"."+minutes;
		}
		console.log('totaltimehours===');console.log(totalTimeHours);
		return totalTimeHours ;
     };
     
	var getWorkDayHours = function (timeIn, timeOut) {
		
		var timeInarray = timeIn.toString().split(":");
		var minutesFirst = parseInt(timeInarray[0])*60;
		var totalFirstMin = parseInt(minutesFirst) + parseInt(timeInarray[1]);	  
		
		var timeOutarray = timeOut.toString().split(":");
		var minutesSecond = parseInt(timeOutarray[0])*60;
		var totalSecondMin = parseInt(minutesSecond) + parseInt(timeOutarray[1]);
		
		
		if(parseInt(totalSecondMin)<parseInt(totalFirstMin)) {
			$scope.errorMessage ="End Time should be greater than Start Time!";
			return;
		}
		var totalTimeInMinutes	= parseInt(totalSecondMin)-parseInt(totalFirstMin);
		return totalTimeInMinutes ;
	};
		
	this.saveTimesheet = function(timesheet) {
		if($scope.timesheet==undefined){
			$scope.errorMessage ="Please insert valid time!";
			return;
		}
		//totalworkingHour = $scope.getTotoalhours($scope.timesheet);
		//console.log(totalworkingHours);
		
		var dataPromise = userServices.saveDetailTimeSheet($scope.timesheet);
				dataPromise.then(function(response) {
					$scope.timesheet = response;  console.log('Detail Service rseult'+response);
				},function(error) {
					//$scope.status = error;  
					$scope.errorMessage = error;
				});	
	};
	
	$scope.getTotoalhours = function(timesheet) {
		$scope.dayWork = "null";
		$scope.resetMessage();
		var dayTime = lunchTime = nightTime = "0";
 		if($scope.timesheet.in!= undefined && $scope.timesheet.out!= undefined) {	
 			dayTime = getWorkDayHours($scope.timesheet.in,$scope.timesheet.out);				
 		}
		if($scope.timesheet.lunchIn!= undefined && $scope.timesheet.lunchOut!= undefined) {
			lunchTime = getWorkDayHours($scope.timesheet.lunchIn,$scope.timesheet.lunchOut);
		}
		if($scope.timesheet.nightIn!= undefined && $scope.timesheet.nightOut!= undefined) {
			nightTime = getWorkDayHours($scope.timesheet.nightIn,$scope.timesheet.nightOut);
	    }		
	 	$scope.isInvalid($scope.timesheet.in,$scope.timesheet.out);
	 	$scope.isInvalid($scope.timesheet.lunchIn,$scope.timesheet.lunchOut);
	 	$scope.isInvalid($scope.timesheet.nightIn,$scope.timesheet.nightOut);
		var reminDayTime = parseFloat(dayTime)-parseFloat(lunchTime);
		var totalWorkMinutes = parseFloat(reminDayTime)+parseFloat(nightTime);
	    var hours = parseInt(Math.floor(parseInt(totalWorkMinutes)) / 60);          
   		var minutes = parseInt(totalWorkMinutes) % 60;
   		$scope.dayWork = hours+"."+minutes;
		return dayWork ;
	};
	
	 $scope.isInvalid = function(timeIn, timeOut) {
	 	if((timeIn!= undefined && timeOut == undefined) || (timeIn == undefined && timeOut!= undefined) )
	 		$scope.errorMessage = "Please insert valid time!";
	 };
	
	$scope.reset = function() { 
        $scope.timesheet = null;
    };
    $scope.resetMessage = function() { 
        $scope.errorMessage = null;
    };
    
	$scope.reset();
}]);
