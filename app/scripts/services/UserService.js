app.factory("UserService", ['$http', '$q', 'CONFIG', 'AuthService' ,'$cookies',
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
        if (employees.length > 1) {
          userObj = employees[0];
          token = employees[1];
          if (userObj != null && token!= null) {
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
    emailme: function(userObj) {
      var user = AuthService.getAccessToken();
      var empEmail = {'empId': user.userObj.id, 'month': AuthService.getMonthByIndex(moment(user.userObj.doj, "DD-MM-YYYY").month()), 'year': moment(user.userObj.doj, "DD-MM-YYYY").year(), 'token': user.token.token};
      var q = $q.defer();
      $http({
       method: 'POST',
        url: CONFIG.API_URL + '/mailExcelSheet',
        data: empEmail
      }).success(function(response) {
        q.resolve(response);
      }).error(function(response) {
        q.reject(response);
      });
      return q.promise;
    },

    registerUser: function(userObj) {
      var q = $q.defer();
      $http({
        method: 'POST',
        url: CONFIG.API_URL + '/register',
        data: userObj
      }).success(function(response) {
        q.resolve(response);
      }).error(function(response) {
        q.reject(response);
      });
      return q.promise;
    },

    forgotPassword: function(email) {
      var email = {'email': email};
      var q = $q.defer();
      $http({
        method: 'POST',
        url: CONFIG.API_URL + '/forgotPwd',
        data: email
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
      angular.forEach(cookies, function (v, k) {
          $cookies.remove(k);
      });
      return true;
    },
    resetPassword: function (resetPassword) {
      var reset = {'empId' : resetPassword.empId, 'pToken' : resetPassword.pToken, 'newPassword' : resetPassword.password};
      var q = $q.defer();
      $http({
        method: 'POST',
        url: CONFIG.API_URL +  '/pwdVerify',
        crossDomain : true,
        withCredentials : true,
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
      var emp = {'id' : user.userObj.id, 'token' : user.token.token, 'workDate' : workDate};
      var q = $q.defer();
      $http({
        method: 'POST',
        url: CONFIG.API_URL +  '/workDayData',
        crossDomain : true,
        withCredentials : true,
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
