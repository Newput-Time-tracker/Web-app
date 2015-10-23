app.controller('userTimesheetController', ['$scope', 'userServices', function($scope, userServices){
	var currentDate = new Date();
	var currentMonth = currentDate.getMonth(); // it gives 0 based result.
	var currentYear = currentDate.getFullYear();
	var monthList = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	$scope.weeksOptions = [];
	$scope.curYear = currentYear ;
	$scope.newCurrentYear = '';
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

	this.weekUpdate = function(){
		$scope.timesheetArr = [];
		if($scope.weekDay.start && $scope.weekDay.end){
			var startDate = $scope.weekDay.start;
			var endDate = $scope.weekDay.end;
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
	function initializeWeek(newCurrentMonth, newCurrentYear){
		var nweeks = getWeeksInMonth(newCurrentMonth, newCurrentYear);
		$scope.weeksOptions.weeks = nweeks;
		$scope.weekDay = $scope.weeksOptions.weeks[0];


	}
	// Initialize the week options 

	if (currentMonth!= '' && currentYear!='') {
		 initializeWeek(currentMonth, currentYear);
	}

	// Generate month options
	function generateMonthSelectBox(start, current, selectedYear){
		var i = 0;
		var obj = {};
		var selectOptions = [];
		if(startYear == selectedYear) {
			i = start;
			obj = {'value': start, 'label': monthList[start]};
			current = 11;
		} else if(selectedYear == currentYear) {
			obj = {'value': current, 'label': monthList[current]};

		}else {
			i = 0;
			current = 11;
			obj = {'value': i, 'label': monthList[i]};
		}
		for(i; i <= current; i++){
			selectOptions.push({'value': i, 'label': monthList[i]});
		}
		selectOptions.currentmonth = obj;
		$scope.selectedMonth = obj.label;
		return selectOptions;
	}

	// Generate year options

	function generateYearSelectBox(start, current){
		var selectOptions = [];
		for(var i = current; i >= start; i--) {
			selectOptions.push({'value': i, 'label': i});
		}
		selectOptions.current = {'value': current, 'label': current};
		return selectOptions;
	}

	// Calling of service to set the user data object after login.
	$scope.employees = userServices.getProperty();

	//Restrict the month and year to date of joining
	var doj = parseInt($scope.employees.doj);
	var dojYear = new Date(doj);
	var startYear= dojYear.getFullYear();
	$scope.yearOptions = generateYearSelectBox(startYear, currentYear);
	var startMonth = dojYear.getMonth();
	$scope.monthsOptions = generateMonthSelectBox(startMonth-1, currentMonth, currentYear);
	
	// Update year 
	this.yearUpdate = function(){
		var newCurrentYear = $scope.yearOptions.current.value; 
		$scope.monthsOptions = generateMonthSelectBox(startMonth-1, currentMonth, newCurrentYear);
		$scope.weeksDateStr = '';
		initializeWeek(currentMonth, newCurrentYear);

	}

	// Update Month

	this.monthUpdate = function(){
		var newCurrentMonth = $scope.monthsOptions.currentmonth.value;
		var newCurrentYear = $scope.yearOptions.current.value;
		$scope.selectedMonth = monthList[newCurrentMonth];
		initializeWeek(newCurrentMonth, newCurrentYear);
		$scope.weeksDateStr = '';
	}
	

}]);