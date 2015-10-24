app.controller('forgotPasswordController',['$scope', function() {
	this.fetchPwd = function() {	
		var dataPromise = userServices.forgotPassword($scope.email);
		dataPromise.then(function(response) {
			$scope.email = response;  console.log('service rseult'+response);
		},function(error) {
			//$scope.status = error;  
		$scope.errorMessage = error;
	});
}]);
