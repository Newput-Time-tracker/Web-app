app.controller('loginController', ['$scope', '$location', 'userServices', function($scope, $location, userServices){
	this.verifyUser = function() {
		var employeesPromise = userServices.authUser($scope.user);
		employeesPromise.then(function(res){
				$scope.employees = res;
			}, function(error){
				console.log(error);
		});
		$location.path('/usertimesheet');
	};
	this.toLocation = function(loc){
		$location.path('/'+loc);
	};
}]);
