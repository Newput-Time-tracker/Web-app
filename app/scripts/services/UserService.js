app.factory("UserService", ['$http', '$q', 'appSettings', '$cookies',
function($http, $q, appSettings, $cookies) {
  var userJsonData = [];
  return {
    authUser : function(user) {
      var q = $q.defer();
      $http({
       method : 'POST',
        url : appSettings.serverBaseUrl + '/login',
        data : user,
        crossDomain : true,
        withCredentials : true,
        headers : {
          'Content-Type' : 'application/x-www-form-urlencoded'
        }
      }).success(function(response) {
        userJsonData = response;
        q.resolve(response);
      }).error(function(response) {
        q.reject(response);
      });
      return q.promise;
    },

    emailme : function(userObj) {
      var q = $q.defer();
      $http({
        method : 'POST',
        url : appSettings.serverBaseUrl + '/mailExcelSheet',
        data : userObj.dataobj,
        headers : userObj.header
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
        url : appSettings.serverBaseUrl + '/register',
        data : userObj,
        crossDomain : true,
        withCredentials : true,
        headers : {
          'Content-Type' : 'application/x-www-form-urlencoded'
        }
      }).success(function(response) {
        q.resolve(response);
      }).error(function(response) {
        q.reject(response);
      });
      return q.promise;
    },

    forgotPassword : function(email) {
      var q = $q.defer();
      $http({
        method : 'POST',
        url : appSettings.serverBaseUrl + '/register',
        data : email,
        crossDomain : true,
        withCredentials : true,
        headers : {
          'Content-Type' : 'application/x-www-form-urlencoded'
        }
      }).success(function(response) {
        q.resolve(response);
      }).error(function(response) {
        q.reject(response);
      });
      return q.promise;
    },

    saveDetailTimeSheet : function(timeSheet) {
      var q = $q.defer();
      $http({
        method : 'POST',
        url : appSettings.serverBaseUrl + '/timeEntry',
        data : timeSheet,
        crossDomain : true,
        withCredentials : true,
        headers : {
          'Content-Type' : 'application/x-www-form-urlencoded'
        }
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
      var emp = {'empId': '12', 'year': '2015', 'month': 'october', 'token': '3B7B86D5FCF448C9AC1FF6AA4C78B99B'};
      var q = $q.defer();
      $http({
        method : 'POST',
        url : appSettings.SERVER_BASE_URL + '/monthlyExcel',
        crossDomain : true,
        withCredentials : true,
        data: emp,
        headers : {
          'Content-Type' : 'application/x-www-form-urlencoded'
        }
      }).success(function(response) {
        q.resolve(response);
      }).error(function(response) {
        q.reject(response);
      });
      return q.promise;
  }
  };

}]);
