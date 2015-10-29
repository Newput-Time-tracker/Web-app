app.factory("AuthService", ['$http', '$q', 'appSettings', '$cookies',
function($http, $q, appSettings, $cookies) {
  return {
    setAccessToken : function(token, userObj) {
      var expiry = null ;
      if(token.expire)
        expire = expiry;
      else
        expire = appSettings.EXPIRY_TIME;
      var now = new Date();
      now.setDate(now.getDate() + expire); // set the cookie for 1 year from now.
      $cookies.put('accessToken', JSON.stringify(token), {expires: now});
      $cookies.put('UserObj', JSON.stringify(userObj), {expires: now});
    },
    getAccessToken : function() {
      var accessToken = $cookies.get('accessToken');
      var UserObj = $cookies.get('UserObj');
      if (accessToken && UserObj) {
        var cookieObj = {'token': JSON.parse(accessToken), 'userObj': JSON.parse(UserObj)} ;
      } else {
        var cookieObj = null;
      }
      return cookieObj;
    }
  };
}]);

