app.controller('forgotPasswordController',['$scope', 'userServices', function($scope, userServices) {
	this.fetchPwd = function() {	
		var dataPromise = userServices.forgotPassword($scope.email);
		dataPromise.then(function(response) {
			$scope.email = response;  console.log('service rseult'+response);
		},function(error) {
			//$scope.status = error;  
			$scope.errorMessage = error;
		});
	};
}]);
