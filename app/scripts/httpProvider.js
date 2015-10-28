app.config(['$httpProvider',
function($httpProvider) {
  /**
   * The workhorse; converts an object to x-www-form-urlencoded serialization.
   * @param {Object} obj
   * @return {String}
   */
  var toParam = function(obj) {
    var query = '',
        name,
        value,
        fullSubName,
        subName,
        subValue,
        innerObj,
        i;

    for (name in obj) {
      value = obj[name];

      if ( value instanceof Array) {
        for ( i = 0; i < value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += toParam(innerObj) + '&';
        }
      } else if ( value instanceof Object) {
        for (subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += toParam(innerObj) + '&';
        }
      } else if (value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }

    return query.length ? query.substr(0, query.length - 1) : query;
  };

  $httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

  $httpProvider.defaults.transformRequest = [
  function(data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? toParam(data) : data;
  }];
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];

  //$httpProvider.interceptors.push("HttpRequest");
}]);