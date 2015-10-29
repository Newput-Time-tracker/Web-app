app.controller('userTimesheetController', ['$scope', '$location', 'UserService',
function($scope, $location, UserService) {
  $scope.employees = null;
  var currentDate = new Date();
  var currentMonth = currentDate.getMonth();
  // it gives 0 based result.
  var currentYear = currentDate.getFullYear();
  var monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  $scope.weeksOptions = [];
  $scope.curYear = currentYear;
  $scope.newCurrentYear = '';
  var timesheetArr = {};
  $scope.timesheetData = {};

  // get weeks by date in a month
  function getWeeksInMonth(month, year) {
    var weeks = [],
        firstDate = new Date(year, month, 1),
        lastDate = new Date(year, month + 1, 0),
        numDays = lastDate.getDate();

    var start = 1;
    var end = 7 - firstDate.getDay();
    weeks.push({
      'key' : '--Weeks--',
      'start' : null,
      'end' : null
    });
    while (start <= numDays) {
      var upto = start + ' to ' + end;
      weeks.push({
        'key' : upto,
        'start' : start,
        'end' : end
      });
      start = end + 1;
      end = end + 7;
      if (end > numDays)
        end = numDays;
    }
    return weeks;
  }

  // append suffix to week numbers (NOT IN USE RIGHT NOW)
  function weekSuffix(num) {
    var i = num % 10;
    var suffix = '';
    if (num == 1) {
      suffix = 'st';
    } else if (i == 2) {
      suffix = 'nd';
    } else if (i == 3) {
      suffix = 'rd';
    } else {
      suffix = 'th';
    }
    return num + suffix;
  }

  function formateDate(date) {
    var dDate = moment(date, ["DD-MM-YYYY"]);
    dDate = dDate.date();
    return dDate;
  }
  function fromatHours(hours){
    var splitHrs = hours.split(':');
    var perDayMins = parseInt((splitHrs[0]*60)) + parseInt(splitHrs[1]);
    return perDayMins;
  }
  // time sheet
  $scope.showTimesheet = function() {
    var totalMins = 0;
    var monthlyData = UserService.timesheetData();
    monthlyData.then(function(res){
      if (res.success) {
        timesheetArr = res.data;
        if (timesheetArr.length > 0) {
          for(var i = 0; i < timesheetArr.length; i++) {
            var date = timesheetArr[i].workDate;
            date = formateDate(date);
            timesheetArr[i].day = date ;
            var hours = timesheetArr[i].totalHour;
            var perDayMins = fromatHours(hours);
            totalMins = parseInt(perDayMins) + parseInt(totalMins);
          }
          var perHrs = parseInt(totalMins / 60);
          var perMins = parseInt(totalMins % 60);
          totalMins = perHrs+':'+perMins+' hrs';
          timesheetArr.totalHours = totalMins;
          $scope.timesheetData = timesheetArr;
        }
      }
    }, function(error){
      console.log(error);
    });
  };
  function calculatetime(timesheetData){
    var totalMins = 0;
    for(var i = 0; i < timesheetData.length; i++){
      var hours = timesheetData[i].totalHour;
      var perDayMins = fromatHours(hours);
      totalMins = parseInt(perDayMins) + parseInt(totalMins);
      var perHrs = parseInt(totalMins / 60);
      var perMins = parseInt(totalMins % 60);
      totalMins = perHrs+':'+perMins+' hrs';
    }
    return totalMins;
  }
  this.weekUpdate = function() {
    $scope.timesheetData = {};

    if ($scope.weekDay.start && $scope.weekDay.end) {
      var startDate = $scope.weekDay.start;
      var endDate = $scope.weekDay.end;
      $scope.weeksDateStr = weekSuffix(startDate) + ' to ' + weekSuffix(endDate);
      var i = 0;
      for (var j = 0; j <= timesheetArr.length; j++) {
        if((timesheetArr[j] != undefined) && (timesheetArr[j].day >= startDate) && (timesheetArr[j].day <= endDate)) {
          $scope.timesheetData[i] = timesheetArr[j];
          i++;
        }
        $scope.timesheetData.length = i;
      }
      var totalHours = calculatetime($scope.timesheetData);
      $scope.timesheetData.totalHours = totalHours;
    } else {
      $scope.weeksDateStr = '';
      $scope.timesheetData = timesheetArr;
    }
  };
  function initializeWeek(newCurrentMonth, newCurrentYear) {
    var nweeks = getWeeksInMonth(newCurrentMonth, newCurrentYear);
    $scope.weeksOptions.weeks = nweeks;
    $scope.weekDay = $scope.weeksOptions.weeks[0];

  }

  // Initialize the week options

  if (currentMonth != '' && currentYear != '') {
    initializeWeek(currentMonth, currentYear);
  }

  // Generate month options
  function generateMonthSelectBox(start, current, selectedYear) {
    var i = 0;
    var obj = {};
    var selectOptions = [];
    if (startYear == selectedYear) {
      i = start;
      obj = {
        'value' : start,
        'label' : monthList[start]
      };
      current = 11;
    } else if (selectedYear == currentYear) {
      obj = {
        'value' : current,
        'label' : monthList[current]
      };

    } else {
      i = 0;
      current = 11;
      obj = {
        'value' : i,
        'label' : monthList[i]
      };
    }
    for (i; i <= current; i++) {
      selectOptions.push({
        'value' : i,
        'label' : monthList[i]
      });
    }
    selectOptions.currentmonth = obj;
    $scope.selectedMonth = obj.label;
    return selectOptions;
  }

  // Generate year options

  function generateYearSelectBox(start, current) {
    var selectOptions = [];
    for (var i = current; i >= start; i--) {
      selectOptions.push({
        'value' : i,
        'label' : i
      });
    }
    selectOptions.current = {
      'value' : current,
      'label' : current
    };
    return selectOptions;
  }

  //Restrict the month and year to date of joining
  var cookieObj = UserService.getAccessToken();
  if (cookieObj) {
    $scope.employees = cookieObj.userObj;
  } else {
    // fetch login's userdata from service
    var userObj = UserService.getProperty();
    if (userObj != '') {
      if (userObj.success && userObj.data[0]) {
        $scope.employees = userObj.data[0];
      }
    } else {
      $location.path('/login');
    }
  }
  if ($scope.employees != null) {
    var doj = parseInt($scope.employees.doj);
    var dojYear = new Date(doj);
    var startYear = dojYear.getFullYear();
    $scope.yearOptions = generateYearSelectBox(startYear, currentYear);
    var startMonth = dojYear.getMonth();
    $scope.monthsOptions = generateMonthSelectBox(startMonth, currentMonth, currentYear);
  }
  // Update year
  this.yearUpdate = function() {
    var newCurrentYear = $scope.yearOptions.current.value;
    $scope.monthsOptions = generateMonthSelectBox(startMonth, currentMonth, newCurrentYear);
    $scope.weeksDateStr = '';
    initializeWeek(currentMonth, newCurrentYear);
  };

  // Update Month

  this.monthUpdate = function() {
    var newCurrentMonth = $scope.monthsOptions.currentmonth.value;
    var newCurrentYear = $scope.yearOptions.current.value;
    $scope.selectedMonth = monthList[newCurrentMonth];
    initializeWeek(newCurrentMonth, newCurrentYear);
    $scope.weeksDateStr = '';
  };

  //email excel sheet

  $scope.emailme = function() {
    var userObj = {};
    userObj.dataobj = {
      'empId' : '62',
      'month' : 'October',
      'year' : '2015'
    };
    userObj.header = {
      'token' : '3321EEAE282680B4173FCE770865E293',
      'Content-Type' : 'application/javascript'
    };
    var emailPromise = UserService.emailme(userObj);
    emailPromise.then(function(res) {
      $scope.detail = res;
    }, function(error) {

    });
  };

}]);