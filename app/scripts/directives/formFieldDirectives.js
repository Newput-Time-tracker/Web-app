app.directive('pwCheck', function() {
  return {
    require: 'ngModel',
    scope: {
      otherModelValue: '= pwCheck'
    },
    link: function(scope, element, attributes, ngModel) {
      ngModel.$validators.pwCheck = function(modelValue) {
        return modelValue == scope.otherModelValue;
      };

      scope.$watch('otherModelValue', function() {
        ngModel.$validate();
      });
    }
  };
});
