app.controller('detailViewController', ['$scope', function($scope){	
	
	this.saveTimesheet = function(timesheet) {
		console.log($scope.timesheet);
		var dayin= dayout= lunchin= lunchout= nightin= nightout=0;
		
		var timeSheet =$scope.timesheet ;
			//console.log(timeSheet); alert(timeSheet.dayin);
			alert(timeSheet.dayout+timeSheet.dayin+timeSheet.nightout+timeSheet.nightin);
			var totalHours = (timeSheet.dayout-timeSheet.dayin)+(timeSheet.nightout-timeSheet.nightin)-(timeSheet.lunchout-timeSheet.lunchin);
			alert(totalHours);
			//alert(dayin);
		var totalHour=0;	
		
	};
	$scope.reset = function() { 
        $scope.user = "";
    };
    $scope.reset();
	
}]);
