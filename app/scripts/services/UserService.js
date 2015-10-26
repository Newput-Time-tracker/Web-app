app.factory("UserService", ['$http', '$q', 'appSettings', '$cookies', function($http, $q, appSettings, $cookies) {
var userJsonData = [];
return {
  authUser: function(user) {
    var q = $q.defer();
    $http({ 
      method: 'POST', 
      url: appSettings.serverBaseUrl+'/login',
      data: user
    }).success(function(response) {
      q.resolve(response);
    }).
    error(function(response) {
      q.reject(response);
    });
    return q.promise;
    //userJsonData = ({firstname:"Varsha", lastname:"Tyagi", doj: '1382812200000'});
    //return userJsonData;
  },
  
  getProperty: function() {
    return userJsonData;
  },
  
  emailme: function(userObj) {
    var q = $q.defer();
    $http({ 
      method: 'POST', 
      url: appSettings.serverBaseUrl+'/mailExcelSheet',
      data: userObj.dataobj,
      headers : userObj.header
    }).success(function(response) {
      q.resolve(response);
    }).
    error(function(response) {
      q.reject(response);
    });
    return q.promise;
  },
  
  registerUser: function(userObj) {
    var q = $q.defer();
    $http({ 
      method: 'POST', 
      url: appSettings.serverBaseUrl+'/register',
      data: userObj,
      crossDomain: true,
      withCredentials: true,
      headers : {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).success(function(response) {
      q.resolve(response);
    }).
    error(function(response){
      q.reject(response);
    });
    return q.promise;
  },
  
  forgotPassword: function(email) {
    var q = $q.defer();
    $http({ 
      method: 'POST', 
      url: appSettings.serverBaseUrl+'/register',
      data: email,
      crossDomain: true,
      withCredentials: true,
      headers : {
      'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).success(function(response) {
      q.resolve(response);
    }).
    error(function(response) {
      q.reject(response);
    });
    return q.promise;
  },
  
  saveDetailTimeSheet: function(timeSheet) {
    var q = $q.defer();
    $http({ 
      method: 'POST', 
      url: appSettings.serverBaseUrl+'/timeEntry',
      data: timeSheet,
      crossDomain: true,
      withCredentials: true,
      headers : {
      'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).success(function(response){
      q.resolve(response);
    }).
    error(function(response){
      q.reject(response);
    });
    return q.promise;
  },
  
  getProperty: function() {
      return userJsonData;
    },
  setAccessToken: function(){
    $cookies.accessToken = userJsonData.token;
  },
  getAccessToken: function(){
    var accessToken = $cookies.accessToken;
    return accessToken;      
  }
};
  
}]);
