app.factory('HttpRequest', function($q, $rootScope) {

  var authToken = 'FB3AA4D6F393D0AEAEC5B3F65DBE3463';

  return {
    'request' : function(config) {
      config.headers['Authorization'] = "bearer " + authToken;
      return config;
    }
  };
});