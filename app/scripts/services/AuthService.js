/* global app: false */

app.factory("AuthService", ['$http', '$q', 'CONFIG', '$cookies',
function($http, $q, CONFIG, $cookies) {
  var _userSession = null;
  return {

    setUser: function(token, userObj) {
      _userSession = {'token': token, 'userObj': userObj};
    },

    getUser: function() {
      return _userSession;
    },

    setAccessToken: function(token, userObj) {
      var expire = null;
      if (token.expire) {
        expire = token.expire;
      } else {
        expire = CONFIG.SESSION_COOKIE.EXPIRY;
      }
      var now = new Date();
      now.setDate(now.getDate() + expire); // set the cookie for 1 year from now.
      $cookies.put('accessToken', JSON.stringify(token), {expires: now});
      $cookies.put('UserObj', JSON.stringify(userObj), {expires: now});
    },
    getAccessToken: function() {
      var accessToken = $cookies.get('accessToken');
      var UserObj = $cookies.get('UserObj');
      var cookieObj = {};
      if (accessToken && UserObj) {
        cookieObj = {'token': JSON.parse(accessToken), 'userObj': JSON.parse(UserObj)};
      } else {
        cookieObj = null;
      }
      return cookieObj;
    },
    verifyUser: function(verifyUser) {
      var user = {'email': verifyUser.EM, 'token': verifyUser.ET };
      var q = $q.defer();
      $http({
        method: 'POST',
        url: CONFIG.API_URL + '/verify',
        data: user,
        crossDomain: true,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).success(function(response) {
        q.resolve(response);
      }).error(function(response) {
        q.reject(response);
      });
      return q.promise;
    },
    getMonthByIndex: function(index) {
      var monthNames = ["January", "February", "March", "April", "May", "June",
         "July", "August", "September", "October", "November", "December"
          ];
      return monthNames[index + 1];
    },
    clearUrlTracker: function() {
      $cookies.remove('urlTracker');
      return true;
    }
  };
}]);

