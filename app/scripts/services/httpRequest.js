/* global app: false */

app.factory('HttpRequest', function($rootScope, CONFIG) {
  // var authToken = 'FB3AA4D6F393D0AEAEC5B3F65DBE3463';
  return {
    // 'request': function(config) {
      // config.headers['token'] = authToken;
      // config.headers['empId'] = 12;
      // return config;
    // },

    'responseError': function(rejection) {
      if (rejection.status == CONFIG.MISSING_PARAMETER && rejection.status == CONFIG.UNAUTHORIZE_ACCESS) {
        $rootScope.$broadcast("authFailure");
      }
    }
  };
});
