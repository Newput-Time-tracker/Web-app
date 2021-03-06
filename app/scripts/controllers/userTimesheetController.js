/* global moment: false */
/* global app: false */

app.controller('userTimesheetController', ['$scope', '$routeParams', 'CONFIG', '$rootScope', '$location', 'UserService', 'AuthService',
function($scope, $routeParams, CONFIG, $rootScope, $location, UserService, AuthService) {
  $scope.employees = null;
  $scope.token = null;
  var cookieObj = AuthService.getAccessToken();
  var loginUserObj = null;
  if (cookieObj != null) {
    $scope.token = cookieObj.token;
    $scope.employees = cookieObj.userObj;
  } else {
    // fetch login's userdata from service
    loginUserObj = UserService.getProperty();
    if (loginUserObj) {
      if (loginUserObj.success && loginUserObj.data[0]) {
        $scope.employees = loginUserObj.data[0];
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
  var startMonth = null;
  $scope.newCurrentYear = '';
  var timesheetArr = {};
  $scope.timesheetData = {};
  var monthLabel = '';
  var perMonthEmpObj = {};
  $scope.yearText = $scope.curYear;
  // store the day corresponding to the timesheet
  var weekList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  $rootScope.detailTimesheetByIndex = {};
  var startYear = null;
  $scope.monthlyDataAvailablityStatus = false;
  $scope.monthlyDataAvailablityMessage = '';
  $scope.monthStart = 1;
  $scope.monthEnd = 0;
  $scope.disabledAttr = false;
  $scope.icon = false;

  // append suffix to week numbers (NOT IN USE RIGHT NOW)
  function weekSuffix(num) {
    var i = num % CONFIG.MOD;
    var suffix = '';
    if (num == CONFIG.ST_SUFFIX) {
      suffix = 'st';
    } else if (i == CONFIG.ND_SUFFIX) {
      suffix = 'nd';
    } else if (i == CONFIG.RD_SUFFIX) {
      suffix = 'rd';
    } else {
      suffix = 'th';
    }
    return num + suffix;
  }

  function formateDate(date, flag) {
    var momentObj = moment(date, ["DD-MM-YYYY"]);
    var dDay = null;
    if (flag == 1) {
      dDay = momentObj.date();
    } else if (flag == 2) {
      dDay = weekList[momentObj.day()].substring(0, CONFIG.TRIM_CHARACTERS);
    }
    return dDay;
  }

  // get weeks by date in a month
  function getWeeksInMonth(month, year) {
    var weeks = [];
    var firstDate = new Date(year, month, 1);
    var lastDate = new Date(year, month + 1, 0);
    var numDays = lastDate.getDate();
    var start = 1;
    var end = CONFIG.WEEK_DAYS - firstDate.getDay();
    var count = 1;
    var weeklyStartDate = '';
    var weeklyEndDate = '';
    weeks.push({ 'key': 'Select Week', 'start': null, 'end': null });
    while (start <= numDays) {
      weeklyStartDate = start + '-' + (lastDate.getMonth() + 1) + '-' + lastDate.getFullYear();
      var weeklyStartDay = formateDate(weeklyStartDate, 2);
      weeklyEndDate = end + '-' + (lastDate.getMonth() + 1) + '-' + lastDate.getFullYear();
      var weeklyEndDay = formateDate(weeklyEndDate, 2);
      var upto = weeklyStartDay + ' ' + weekSuffix(start) + ' to ' + weeklyEndDay + ' ' + weekSuffix(end) + ' (' + weekSuffix(count) + ' Week) ';
      weeks.push({
        'key': upto,
        'start': start,
        'end': end
      });
      start = end + CONFIG.START_OF_THE_WEEK;
      end += CONFIG.END_OF_THE_WEEK;
      $scope.monthEnd = numDays;
      if (end > numDays) {
        end = numDays;
        $scope.monthEnd = numDays;
      }
      count++;
    }
    return weeks;
  }

  function fromatHours(hours) {
    var splitHrs = hours.split(':');
    var perDayMins = parseInt((splitHrs[0] * CONFIG.MIN_PER_HOUR), 10) + parseInt(splitHrs[1], 10);
    return perDayMins;
  }

  function trimDesc(desc) {
    var trimmedString = desc.substr(0, CONFIG.MAX_LENGTH);
    if (trimmedString.length != desc.length) {
      trimmedString += '...';
    }
    // trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
    return trimmedString;
  }

  function calculateTimeAndDesc(timesheetData) {
    var totalMins = 0;
    var desc = null;
    for (var i = 0; i < timesheetData.length; i++) {
      var hours = timesheetData[i].totalHour;
      if (timesheetData[i].workDesc != '') {
        desc = trimDesc(timesheetData[i].workDesc);
        timesheetData[i].description = desc;
      }
      if (hours != '') {
        var perDayMins = fromatHours(hours);
        totalMins = parseInt(perDayMins, 10) + parseInt(totalMins, 10);
      }
    }
    if (totalMins) {
      var perHrs = parseInt(totalMins / CONFIG.MIN_PER_HOUR, 10);
      var perMins = parseInt(totalMins % CONFIG.MIN_PER_HOUR, 10);
      totalMins = perHrs + '.' + perMins;
    } else {
      totalMins = 0.0;
    }

    return totalMins;
  }

  function populatePerDayData(index, monthIndex, yearIndex) {
    var workDate = index + '-' + (monthIndex + 1) + '-' + yearIndex;
    var dDate = formateDate(workDate, 1);
    var dDay = formateDate(workDate, 2);
    var perDayData = {
      'day': dDate,
      'dayName': dDay,
      'in': '',
      'lunchIn': '',
      'lunchOut': '',
      'nightIn': '',
      'nightOut': '',
      'out': '',
      'totalHour': '',
      'workDate': workDate,
      'workDesc': '',
      'newEntry': true
    };
    return perDayData;
  }

  function populateTimesheet(res) {
    var localDS = {};
    var workDate = null;
    var dDate = null;
    var dDay = null;
    var status = false;
    var oneDayData = {};
    var monthIndex = $scope.monthsOptions.currentmonth.value;
    var yearIndex = $scope.yearOptions.current.value;
    // TODO: why added +1 in month index
    var lastDate = new Date(yearIndex, monthIndex + 1, 0);
    var days = lastDate.getDate();
    var monthlyTimesheet = [];
    for (var index = 1, j = 0; index <= days; index++) {
      if (typeof res == 'undefined') {
        oneDayData = populatePerDayData(index, monthIndex, yearIndex);
        monthlyTimesheet.push(oneDayData);
      } else {
        if (typeof res[j] != 'undefined') {
          workDate = res[j].workDate;
          dDate = formateDate(workDate, 1);
          dDay = formateDate(workDate, 2);
          localDS = res[j];
          localDS.length = 1;
          localDS.day = dDate;
          localDS.dayName = dDay;
          status = false;
          localDS.newEntry = false;
        } else {
          status = true;
        }
        if ((localDS.length > 0) || status) {
          if (localDS.day == index) {
            monthlyTimesheet.push(localDS);
            $rootScope.detailTimesheetByIndex[workDate] = localDS;
            j++;
            localDS = {};
          } else {
            workDate = index + '-' + (monthIndex + 1) + '-' + yearIndex;
            dDate = formateDate(workDate, 1);
            dDay = formateDate(workDate, 2);
            oneDayData = {
              'day': dDate,
              'dayName': dDay,
              'in': '',
              'lunchIn': '',
              'lunchOut': '',
              'nightIn': '',
              'nightOut': '',
              'out': '',
              'totalHour': '',
              'workDate': workDate,
              'workDesc': '',
              'newEntry': true
            };
            monthlyTimesheet.push(oneDayData);
            $rootScope.detailTimesheetByIndex[workDate] = oneDayData;
          }
        }
      }
    }
    return monthlyTimesheet;
  }

  // time sheet
  $scope.showTimesheet = function(perMonthObj) {
    var totalhrs = 0;
    timesheetArr = {};
    if ($routeParams.day) {
      $scope.activeDay = formateDate($routeParams.day, 1);
    }
    var monthlyData = UserService.timesheetData(perMonthObj);
    monthlyData.then(function(res) {
      if (res.success) {
        var cookies = AuthService.getAccessToken();
        if (cookies) {
          AuthService.setAccessToken(cookies.token, cookies.userObj, res.expire);
        }
        $scope.message = '';
        if (res.data.length > 0) {
          $scope.icon = true;
          timesheetArr = populateTimesheet(res.data);
          totalhrs = calculateTimeAndDesc(timesheetArr);
          timesheetArr.totalHours = totalhrs;
          $scope.timesheetData = timesheetArr;
          // $scope.timesheetData.activeDay = $scope.activeDay;
          $scope.monthlyDataAvailablityStatus = false;
          $scope.disabledAttr = false;
        }
      } else {
        $scope.icon = false;
        var msg = 'undefined';
        if (perMonthObj.year == $scope.curYear) {
          if (perMonthObj.month != monthList[$scope.curMonth]) {
            $scope.monthlyDataAvailablityStatus = true;
            $scope.monthlyDataAvailablityMessage = 'Data is not avaibale for this month.';
            $scope.disabledAttr = true;
          } else {
            $scope.monthlyDataAvailablityStatus = false;
            $scope.disabledAttr = false;
          }
        } else {
          $scope.monthlyDataAvailablityStatus = true;
          $scope.disabledAttr = true;
          $scope.monthlyDataAvailablityMessage = 'Data is not avaibale for this month.';
        }
        if ($scope.monthlyDataAvailablityStatus != true) {
          timesheetArr = populateTimesheet(msg);
          totalhrs = calculateTimeAndDesc(timesheetArr);
          timesheetArr.totalHours = totalhrs;
          $scope.timesheetData = {};
          $scope.timesheetData = timesheetArr;
        }
      }
    }, function() {});
  };

  this.weekUpdate = function() {
    $scope.timesheetData = {};
    if ($scope.weekDay.start && $scope.weekDay.end) {
      var startDate = $scope.weekDay.start;
      var endDate = $scope.weekDay.end;
      $scope.weeksDateStr = weekSuffix(startDate) + ' to ' + weekSuffix(endDate);

      var i = 0;
      for (var j = 0; j < timesheetArr.length; j++) {
        if ((typeof timesheetArr[j] != 'undefined') && (timesheetArr[j].day >= startDate) && (timesheetArr[j].day <= endDate)) {
          $scope.timesheetData[i] = timesheetArr[j];
          i++;
        }
        $scope.timesheetData.length = i;
      }
      var totalHours = calculateTimeAndDesc($scope.timesheetData);
      $scope.timesheetData.totalHours = totalHours;
    } else {
      $scope.weeksDateStr = '';
      $scope.timesheetData = timesheetArr;
    }
  };
  function initializeWeek(newCurrentMonth, newCurrentYear) {
    $scope.lastWeek = '';
    var nweeks = getWeeksInMonth(newCurrentMonth, newCurrentYear);
    $scope.weeksOptions.weeks = nweeks;
    $scope.lastWeek = 'form ' + $scope.monthStart + ' to ' + $scope.monthEnd;
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
      obj = { 'value': start, 'label': monthList[start] };
      current = 11;
    } else if ((startYear == selectedYear) && (selectedYear == currentYear)) {
      i = start;
      obj = { 'value': current, 'label': monthList[current] };
    } else if (selectedYear == currentYear) {
      obj = { 'value': current, 'label': monthList[current] };
    } else {
      i = 0;
      current = 11;
      obj = { 'value': i, 'label': monthList[i] };
    }
    for (i; i <= current; i++) {
      selectOptions.push({ 'value': i, 'label': monthList[i] });
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
        'value': i,
        'label': i
      });
    }
    selectOptions.current = {
      'value': current,
      'label': current
    };
    return selectOptions;
  }

  // Restrict the month and year to date of joining

  cookieObj = AuthService.getAccessToken();
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
    startYear = dojYear.year();
    $scope.yearOptions = generateYearSelectBox(startYear, currentYear);
    startMonth = dojYear.month();
    $scope.monthsOptions = generateMonthSelectBox(startMonth, currentMonth, currentYear);
    monthLabel = $scope.selectedMonth;
    perMonthEmpObj = {
      'empId': $scope.employees.id,
      'year': currentYear,
      'month': monthLabel,
      'token': $scope.token.token
    };
    $scope.showTimesheet(perMonthEmpObj);
  }
  // Update year
  this.yearUpdate = function() {
    var newCurrentYear = $scope.yearOptions.current.value;
    $scope.yearText = newCurrentYear;
    $scope.monthsOptions = generateMonthSelectBox(startMonth, currentMonth, newCurrentYear);
    $scope.weeksDateStr = '';
    initializeWeek(currentMonth, newCurrentYear);
    monthLabel = $scope.selectedMonth;
    perMonthEmpObj = {
      'empId': $scope.employees.id,
      'year': newCurrentYear,
      'month': monthLabel,
      'token': $scope.token.token
    };
    $scope.showTimesheet(perMonthEmpObj);
  };

  // Update Month

  this.monthUpdate = function() {
    var newCurrentMonth = $scope.monthsOptions.currentmonth.value;
    var newCurrentYear = $scope.yearOptions.current.value;
    $scope.selectedMonth = monthList[newCurrentMonth];
    initializeWeek(newCurrentMonth, newCurrentYear);
    $scope.weeksDateStr = '';
    monthLabel = $scope.selectedMonth;
    perMonthEmpObj = {
      'empId': $scope.employees.id,
      'year': newCurrentYear,
      'month': monthLabel,
      'token': $scope.token.token
    };
    $scope.showTimesheet(perMonthEmpObj);
  };
  // email excel sheet
  $scope.emailMe = function() {
    $('#submit-btn').text('Please wait...').attr('disabled', 'disabled');
    $scope.emailStatus = false;
    if ($scope.employees != null) {
      var month = $scope.monthsOptions.currentmonth.value;
      month = monthList[month];
      var year = $scope.yearOptions.current.value;
      var emailTimesheetObj = {
        'empId': $scope.employees.id,
        'month': month,
        'year': year,
        'token': $scope.token.token
      };
      var emailPromise = UserService.emailMe(emailTimesheetObj);
      emailPromise.then(function(response) {
        var cookiesObj = AuthService.getAccessToken();
        if (cookiesObj) {
          AuthService.setAccessToken(cookiesObj.token, cookiesObj.userObj, response.expire);
        }
        $scope.emailStatus = true; // no need to check status
        $('#submit-btn').text('Yes').removeAttr("disabled");
        $('#emailBox').on('hide.bs.modal', function() {
          $scope.message = '';
          $('#email-timesheet-response').html('');
        });
        setTimeout(function() {
          $('#dismiss').trigger('click');
          $scope.message = '';
        }, CONFIG.CLOSE_MODAL_BOX);
      }, function() {}
      );
    }
  };

  $scope.exportMe = function() {
    if ($scope.employees != null) {
      var month = $scope.monthsOptions.currentmonth.value;
      month = monthList[month];
      var year = $scope.yearOptions.current.value;
      var exportTimesheetObj = {
        'empId': $scope.employees.id,
        'month': month,
        'year': year
      };
      var exportPromise = UserService.exportMe(exportTimesheetObj);
      window.open(exportPromise, '_blank');
    }
  };
}]);
