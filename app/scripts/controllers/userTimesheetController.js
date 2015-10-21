app.controller('userTimesheetController', ['$scope', function($scope){
	var currentDate = new Date();
	var currentMonth = currentDate.getMonth(); // it gives 0 based result.
	var currentYear = currentDate.getFullYear();
	$scope.weeksOptions = [];
	$scope.curYear = currentYear ;
	$scope.timesheetData = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
	$scope.timesheetArr = $scope.timesheetData;
	// get weeks by date in a month
	function getWeeksInMonth(month, year){
		var weeks=[],
		firstDate=new Date(year, month, 1),
		lastDate=new Date(year, month+1, 0), 
		numDays= lastDate.getDate();

		var start=1;
		var end=7-firstDate.getDay();
		weeks.push({'key': '--Weeks--', 'start': null, 'end': null });
		while(start<=numDays){
			var upto = start +' to '+end;
			weeks.push({'key': upto, 'start': start, 'end': end });
			start = end + 1;
			end = end + 7;
			if(end>numDays)
			 end=numDays;   
		}        
		return weeks;
	} 
	
	// append suffix to week numbers (NOT IN USE RIGHT NOW)
	function weekSuffix(num){
		var i = num % 10;
		var suffix = '';
		if (num == 1) {
			suffix = 'st';
		} else if (i == 2){
				suffix = 'nd';
		} else if (i == 3) {
				suffix = 'rd';
		} else {
			suffix = 'th';
		}
		return num+suffix;
	}

	
	//get Months
	this.monthsOptions = [
    {'id': 0, 'label': 'January'},
		{'id': 1, 'label': 'Febuary'},
		{'id': 2, 'label': 'March'},
		{'id': 3, 'label': 'April'},
		{'id': 4, 'label': 'MAy'},
		{'id': 5, 'label': 'June'},
		{'id': 6, 'label': 'July'},
		{'id': 7, 'label': 'Augst'},
		{'id': 8, 'label': 'September'},
		{'id': 9, 'label': 'October'},
		{'id': 10, 'label': 'November'}
  ];
  var indexMonth = parseInt(currentMonth);
	this.curMonths = this.monthsOptions[indexMonth].id;
	var monthInfo = this.monthsOptions[indexMonth].label;
	$scope.SelectedMonth = monthInfo;

	this.monthUpdate = function(){
		var indexMonth = parseInt(this.curMonths);
		var monthInfo = this.monthsOptions[indexMonth].label;
		$scope.SelectedMonth = monthInfo;
		var nweeks = getWeeksInMonth(this.curMonths, this.curYear);
		$scope.weeksOptions.weeks = nweeks;
		this.weekDay = $scope.weeksOptions.weeks[0];
		$scope.weeksDateStr = '';
		$scope.timesheetArr = $scope.timesheetData;
	}

	this.yearUpdate = function(){
		var yearInfo = this.curYear;
		var nweeks = getWeeksInMonth(this.curMonths, yearInfo);
		$scope.weeksOptions.weeks = nweeks;
		this.weekDay = $scope.weeksOptions.weeks[0];
		$scope.weeksDateStr = '';
	}

	// get Year
	this.yearOptions = [
    {'value': 2014, 'label': '2014'},
		{'value': 2015, 'label': '2015'}
  ];
  var indexYear = parseInt(currentYear);
  this.curYear = indexYear;
 //  var indexYear = parseInt(currentYear);
	// this.curYear = this.yearOptions[2015].value;

	if (currentMonth!= '' && currentYear!='') {
		var nweeks = getWeeksInMonth(currentMonth, currentYear);
		$scope.weeksOptions.weeks = nweeks;
		this.weekDay = $scope.weeksOptions.weeks[0];
	}

	this.weekUpdate = function(){
		$scope.timesheetArr = [];
		if(this.weekDay.start && this.weekDay.end){
			var startDate = this.weekDay.start;
			var endDate = this.weekDay.end;
			$scope.weeksDateStr = weekSuffix(startDate) +' to '+weekSuffix(endDate);

			for(var i = startDate, j = 0; i <= endDate; j++ ) {
				if($scope.timesheetData[i]) {
					$scope.timesheetArr[j] = $scope.timesheetData[i];
					i++;
				} else {
					break;
				}
				
			}
		} else {
				$scope.weeksDateStr = '';
				$scope.timesheetArr = $scope.timesheetData;
		}
	}

	
}]);