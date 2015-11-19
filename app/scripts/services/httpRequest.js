/* global app: false */

app.factory('HttpRequest', ['$rootScope', 'CONFIG', function($rootScope, CONFIG) {
  return {
    'responseError': function(rejection) {
      if (rejection.status == CONFIG.MISSING_PARAMETER || rejection.status == CONFIG.UNAUTHORIZE_ACCESS) {
        $rootScope.$broadcast("authFailure");
      }
    }
  };
}]);
