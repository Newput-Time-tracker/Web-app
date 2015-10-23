app.controller('loginController', ['$scope', '$location', 'userServices', function($scope, $location, userServices){
	this.verifyUser = function() {
		$scope.employees = userServices.authUser();
		$location.path('/usertimesheet');
	};
	this.toLocation = function(loc){
		$location.path('/'+loc);
	}
}]);
