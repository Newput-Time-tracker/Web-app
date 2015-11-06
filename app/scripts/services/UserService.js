/* global angular: false */
/* global app: false */
/* global moment: false */

app.factory("UserService", ['$http', '$q', 'CONFIG', 'AuthService', '$cookies',
function($http, $q, CONFIG, AuthService, $cookies) {
  var userJsonData = [];
  return {
    authUser: function(user) {
      var q = $q.defer();
      $http({
        method: 'POST',
        url: CONFIG.API_URL + '/login',
        data: user
      }).success(function(response) {
        userJsonData = response;
        var employees = response.data;
        if (employees.length) {
          var userObj = employees[0];
          var token = employees[1];
          if (userObj != null && token != null) {
            AuthService.setUser(token, userObj);
            AuthService.setAccessToken(token, userObj);
          }
        }
        q.resolve(response);
      }).error(function(response) {
        q.reject(response);
      });
      return q.promise;
    },
    emailMe: function(emailTimesheetObj) {
      var q = $q.defer();
      $http({
        method: 'POST',
        url: CONFIG.API_URL + '/mailExcelSheet',
        data: emailTimesheetObj
      }).success(function(response) {
        q.resolve(response);
      }).error(function(response) {
        q.reject(response);
      });
      return q.promise;
    },

    exportMe: function(exportObj) {
      var downloadUrl = CONFIG.API_URL + '/excelExport?empId=' + exportObj.empId + '&month=' + exportObj.month + '&year=' + exportObj.year;
      return downloadUrl;
    },

    registerUser: function(userObj) {
      var userData = userObj;
      var user = {'firstName': userData.firstName, 'lastName': userData.lastName, 'email': userData.email,
      'contact': userData.contact.toString(), 'address': userData.address, 'gender': userData.gender,
      'dob': moment(userData.dob).format('DD-MM-YYYY').toString(), 'password': userData.password,
      'doj': moment(userData.doj).format('DD-MM-YYYY').toString()};
      var q = $q.defer();
      $http({
        method: 'POST',
        url: CONFIG.API_URL + '/register',
        data: user
      }).success(function(response) {
        q.resolve(response);
      }).error(function(response) {
        q.reject(response);
      });
      return q.promise;
    },

    forgotPassword: function(email) {
      var q = $q.defer();
      $http({
        method: 'POST',
        url: CONFIG.API_URL + '/forgotPwd',
        data: {'email': email}
      }).success(function(response) {
        q.resolve(response);
      }).error(function(response) {
        q.reject(response);
      });
      return q.promise;
    },

    saveDetailTimeSheet: function(timeSheet, date) {
      var user = AuthService.getAccessToken();
      timeSheet.empId = user.userObj.id;
      timeSheet.token = user.token.token;
      timeSheet.workDate = date;
      var q = $q.defer();
      $http({
        method: 'POST',
        url: CONFIG.API_URL + '/timeEntry',
        data: timeSheet
      }).success(function(response) {
        q.resolve(response);
      }).error(function(response) {
        q.reject(response);
      });
      return q.promise;
    },
    getProperty: function() {
      return userJsonData;
    },
    timesheetData: function(perMonthEmpObj) {
      var q = $q.defer();
      $http({
        method: 'POST',
        url: CONFIG.API_URL + '/monthlyExcel',
        data: perMonthEmpObj
      }).success(function(response) {
        q.resolve(response);
      }).error(function(response) {
        q.reject(response);
      });
      return q.promise;
    },
    endSession: function() {
      var cookies = $cookies.getAll();
      angular.forEach(cookies, function(v, k) {
        $cookies.remove(k);
      });
      return true;
    },
    resetPassword: function(resetPassword) {
      var reset = {'empId': resetPassword.empId, 'pToken': resetPassword.pToken, 'newPassword': resetPassword.password};
      var q = $q.defer();
      $http({
        method: 'POST',
        url: CONFIG.API_URL + '/pwdVerify',
        crossDomain: true,
        withCredentials: true,
        data: reset
      }).success(function(response) {
        q.resolve(response);
      }).error(function(response) {
        q.reject(response);
      });
      return q.promise;
    },
    getDayData: function(workDate) {
      var user = AuthService.getAccessToken();
      var emp = {'empId': user.userObj.id, 'token': user.token.token, 'workDate': workDate.toString()};
      var q = $q.defer();
      $http({
        method: 'POST',
        url: CONFIG.API_URL + '/workDayData',
        data: emp
      }).success(function(response) {
        q.resolve(response);
      }).error(function(response) {
        q.reject(response);
      });
      return q.promise;
    }
  };
}]);
