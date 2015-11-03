app.controller('userTimesheetController', ['$scope', '$rootScope', '$location', 'UserService', 'AuthService',
function($scope, $rootScope, $location, UserService, AuthService) {
  $scope.employees = null;
  $scope.token = null;
  var cookieObj = AuthService.getAccessToken();
  if (cookieObj != null) {
    $scope.token = cookieObj.token;
    $scope.employees = cookieObj.userObj;
  } else {
    // fetch login's userdata from service
    var userObj = UserService.getProperty();
    if(userObj) {
      if (userObj.success && userObj.data[0]) {
        $scope.employees = userObj.data[0];
      }
    } else {
        $location.path('/login');
    }
  }

  var currentDate = new Date();
  var currentMonth = currentDate.getMonth();
  // it gives 0 based result.
  var currentYear = currentDate.getFullYear();
  var monthList = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  $scope.weeksOptions = [];
  $scope.curYear = currentYear;
  $scope.curMonth = currentMonth;

  $scope.newCurrentYear = '';
  var timesheetArr = {};
  $scope.timesheetData = {};
  var dayArr = [] ; // store the day corresponding to the timesheet
  var weekList = ['Sunday', 'Monday','Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday'];
  $rootScope.detailTimesheetByIndex = {};

  // get weeks by date in a month
  function getWeeksInMonth(month, year) {
    var weeks = [],
    firstDate = new Date(year, month, 1),
    lastDate = new Date(year, month + 1, 0),
    numDays = lastDate.getDate();
    var start = 1;
    var end = 7 - firstDate.getDay();
    weeks.push({
      'key' : '--Select Week--',
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

  function formateDate(date, flag) {
    var momentObj = moment(date, ["DD-MM-YYYY"]);
    if (flag == 1)
      var dDay = momentObj.date();
    else if (flag == 2) {
      var dDay = momentObj.day();
      dDay = weekList[dDay];
    }
    return dDay;
  }
  function fromatHours(hours){
    var splitHrs = hours.split(':');
    var perDayMins = parseInt((splitHrs[0]*60)) + parseInt(splitHrs[1]);
    return perDayMins;
  }


  function calculatetime(timesheetData){
    var totalMins = 0;
    for(var i = 0; i < timesheetData.length; i++){
      var hours = timesheetData[i].totalHour;
      var perDayMins = fromatHours(hours);
      totalMins = parseInt(perDayMins) + parseInt(totalMins);
    }
    var perHrs = parseInt(totalMins / 60);
    var perMins = parseInt(totalMins % 60);
    totalMins = perHrs+':'+perMins;
    return totalMins;
  }
  function populateTimesheet(res){
    var localDS = {};
    var workDate = null ;
    var dDate = null;
    var dDay = null;
    var status = false;
    var monthIndex = $scope.monthsOptions.currentmonth.value;
    var yearIndex = $scope.yearOptions.current.value;
    //TODO: why added +1 in month index
    var lastDate = new Date(yearIndex, monthIndex+1, 0);
    var days = lastDate.getDate();
    var monthlyTimesheet = [];
    for(var index = 1, j = 0; index <= days; index++) {
      if (res[j] != undefined) {
        workDate = res[j].workDate;
        dDate = formateDate(workDate, 1);
        dDay = formateDate(workDate, 2);
        localDS = res[j];
        localDS.length = 1;
        localDS.day = dDate;
        localDS.dayName = dDay;
        status = false;
      } else {
        status = true;
      }

      if ((localDS.length > 0) || status){
        if(localDS.day == index) {
          monthlyTimesheet.push(localDS);
          $rootScope.detailTimesheetByIndex[workDate] = localDS;
          j++;
          localDS = {};
        } else {
          workDate = index+'-'+(monthIndex+1)+'-'+yearIndex ;
          dDate = formateDate(workDate, 1);
          dDay = formateDate(workDate, 2);
          var oneDayData = {'day': dDate, 'dayName': dDay, 'in': '0:00', 'lunchIn': '0:00', 'lunchOut': '0:00', 'nightIn': '0:00',
          'nightOut': '0:00', 'out': '0:00', 'totalHour': '0:00', 'workDate': workDate, 'workDesc': ''};
          monthlyTimesheet.push(oneDayData);
          $rootScope.detailTimesheetByIndex[workDate] = oneDayData;
        }
      }
    }
    return monthlyTimesheet;
  }

  // time sheet
  $scope.showTimesheet = function(perMonthEmpObj) {
    var totalhrs = 0;
    timesheetArr = {};
    $scope.timesheetData = {};
    var monthlyData = UserService.timesheetData(perMonthEmpObj);
    monthlyData.then(function(res){
      if (res.success) {
        $scope.message = '';
        if (res.data.length > 0) {
          timesheetArr = populateTimesheet(res.data);
          totalhrs = calculatetime(timesheetArr);
          timesheetArr.totalHours = totalhrs;
          $scope.timesheetData = timesheetArr;
        }
        else {
          $scope.message = 'No data available for this month !';
        }
      }
    }, function(error){
      console.log(error);
    });
  };

  this.weekUpdate = function() {
    $scope.timesheetData = {};
    if ($scope.weekDay.start && $scope.weekDay.end) {
      var startDate = $scope.weekDay.start;
      var endDate = $scope.weekDay.end;
      $scope.weeksDateStr = weekSuffix(startDate) + ' to ' + weekSuffix(endDate);

      var i = 0;
      for (var j = 0; j < timesheetArr.length; j++) {
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
    if ((startYear == selectedYear) && (selectedYear != currentYear)) {
      i = start;
      obj = {
        'value' : start,
        'label' : monthList[start]
      };
      current = 11;
    } else if ((startYear == selectedYear) && (selectedYear == currentYear)) {
      i = start;
      obj = {
        'value' : current,
        'label' : monthList[current]
      };
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

  var cookieObj = AuthService.getAccessToken();
  if (cookieObj) {
    $scope.employees = cookieObj.userObj;
    $scope.token = cookieObj.token;
  } else {
    // fetch login's userdata from service
    var userObj = UserService.getProperty();
    if (userObj != '') {
      if (userObj.success && userObj.data[0]) {
        $scope.employees = userObj.data[0];
        $scope.token = userObj.data[1];
      }
    } else {
      $location.path('/login');
    }
  }
  if ($scope.employees != null) {
    var doj = $scope.employees.doj;
    var dojYear = moment(doj, ["DD-MM-YYYY"]);
    var startYear = dojYear.year();
    $scope.yearOptions = generateYearSelectBox(startYear, currentYear);
    var startMonth = dojYear.month();
    $scope.monthsOptions = generateMonthSelectBox(startMonth, currentMonth, currentYear);
    var monthLabel = $scope.selectedMonth;
    var perMonthEmpObj = {'empId': $scope.employees.id, 'year': currentYear, 'month': monthLabel, 'token': $scope.token.token};
    $scope.showTimesheet(perMonthEmpObj);
  }
  // Update year
  this.yearUpdate = function() {
    var newCurrentYear = $scope.yearOptions.current.value;
    $scope.monthsOptions = generateMonthSelectBox(startMonth, currentMonth, newCurrentYear);
    $scope.weeksDateStr = '';
    initializeWeek(currentMonth, newCurrentYear);
    var monthLabel = $scope.selectedMonth;
    var perMonthEmpObj = {'empId': $scope.employees.id, 'year': newCurrentYear, 'month': monthLabel, 'token': $scope.token.token};
    $scope.showTimesheet(perMonthEmpObj);
  };

  // Update Month

  this.monthUpdate = function() {
    var newCurrentMonth = $scope.monthsOptions.currentmonth.value;
    var newCurrentYear = $scope.yearOptions.current.value;
    $scope.selectedMonth = monthList[newCurrentMonth];
    initializeWeek(newCurrentMonth, newCurrentYear);
    $scope.weeksDateStr = '';
    var monthLabel = $scope.selectedMonth;
    var perMonthEmpObj = {'empId': $scope.employees.id, 'year': newCurrentYear, 'month': monthLabel, 'token': $scope.token.token};
    $scope.showTimesheet(perMonthEmpObj);
  };
  //email excel sheet
  $scope.emailme = function() {
    if ($scope.employees != null) {
      var month = $scope.monthsOptions.currentmonth.label;
      var year = $scope.yearOptions.current.value;
      //var emailTimesheetObj = {empId: ($scope.employees.id).toString(), month: month, year: year.toString() };
      var emailPromise = UserService.emailme(userObj);
      emailPromise.then(function(res) {
        $scope.message = res.data;
        if ($scope.message.length > 0) {
          $scope.message = $scope.message[0].msg;
        }
      }, function(error) {
        console.log(error);
      });
    }
  };
  // logout user
  $scope.logout = function() {
    var status = UserService.endSession();
    if (status) {
      $location.path('/login');
    }
  };

}]);