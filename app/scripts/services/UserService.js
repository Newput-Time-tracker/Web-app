app.factory("UserService", ['$http', '$q', 'CONFIG', '$cookies',
function($http, $q, CONFIG, $cookies) {
  var userJsonData = [];
  return {
    authUser : function(user) {
      var q = $q.defer();
      $http({
       method : 'POST',
        url : CONFIG.API_URL + '/login',
        data : user
      }).success(function(response) {
        userJsonData = response;
        q.resolve(response);
      }).error(function(response) {
        q.reject(response);
      });
      return q.promise;
    },

    emailme : function(userObj) {
      var data = {'empId': '12', 'month': 'oct', 'year': '2015', 'token': 'AE2DF5413454064A201AE35AD3E3C037'};
      var q = $q.defer();
      $http({
       method : 'POST',
        url : CONFIG.API_URL + '/mailExcelSheet',
        data : data
      }).success(function(response) {
        q.resolve(response);
      }).error(function(response) {
        q.reject(response);
      });
      return q.promise;
    },

    registerUser : function(userObj) {
      var q = $q.defer();
      $http({
        method : 'POST',
        url : CONFIG.API_URL + '/register',
        data : userObj
      }).success(function(response) {
        q.resolve(response);
      }).error(function(response) {
        q.reject(response);
      });
      return q.promise;
    },

    forgotPassword : function(email) {
      var email = {'email' : email};
      var q = $q.defer();
      $http({
        method : 'POST',
        url : CONFIG.API_URL + '/forgotPwd',
        data : email
      }).success(function(response) {
        q.resolve(response);
      }).error(function(response) {
        q.reject(response);
      });
      return q.promise;
    },

    saveDetailTimeSheet : function(timeSheet, date) {
      timeSheet.empId = '12';
      timeSheet.token = 'DDB6ADF177C0AE7D3BC5F28F250EF437';
      timeSheet.workDate = date;
      var q = $q.defer();
      $http({
        method : 'POST',
        url : CONFIG.API_URL + '/timeEntry',
        data : timeSheet
      }).success(function(response) {
        q.resolve(response);
      }).error(function(response) {
        q.reject(response);
      });
      return q.promise;
    },
    getProperty : function() {
      return userJsonData;
    },
    timesheetData: function() {
      var emp = {'empId': '12', 'year': '2015', 'month': 'october', 'token': 'DDB6ADF177C0AE7D3BC5F28F250EF437'};
      var q = $q.defer();
      $http({
        method : 'POST',
        url : CONFIG.API_URL + '/monthlyExcel',
        data: emp
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
        method : 'POST',
        url : CONFIG.API_URL +  '/pwdVerify',
        crossDomain : true,
        withCredentials : true,
        data: reset
      }).success(function(response) {
        q.resolve(response);
      }).error(function(response) {
        q.reject(response);
      });
      return q.promise;
    }
  };
}]);
