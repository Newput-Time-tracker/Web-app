/* global app: false */
/* global angular: false */

app.config(['$httpProvider',
function($httpProvider) {
  var toParam = function(obj) {
    var query = '';
    var name;
    var value;
    var fullSubName;
    var subName;
    var subValue;
    var innerObj;
    var i;

    for (name in obj) {
      if (obj[name]) {
        value = obj[name];
        if (value instanceof Array) {
          for (i = 0; i < value.length; ++i) {
            subValue = value[i];
            fullSubName = name + '[' + i + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += toParam(innerObj) + '&';
          }
        } else if (value instanceof Object) {
          for (subName in value) {
            if (value[subName]) {
              subValue = value[subName];
              fullSubName = name + '[' + subName + ']';
              innerObj = {};
              innerObj[fullSubName] = subValue;
              query += toParam(innerObj) + '&';
            }
          }
        } else if (value !== "" && value !== null) {
          query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }
      }
    }

    return query.length ? query.substr(0, query.length - 1) : query;
  };

  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

  $httpProvider.defaults.transformRequest = [
    function(data) {
      return angular.isObject(data) && String(data) !== '[object File]' ? toParam(data) : data;
    }];
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
  // $httpProvider.interceptors.push("HttpRequest");
}]);
