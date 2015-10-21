app.controller('signUpController', ['$scope', 'signupUser', function($scope, signupUser){	

	this.userSignUp = function(user) {
		console.log($scope.user);
		
		var dataPromise = signupUser.postUserSignUp($scope.user);
		dataPromise.then(function(response) {
			$scope.user = response;  
		},function(error) {
			$scope.status = error;  
		});
	};
	
	/*
	$scope.datepickerOptions = {
					format: 'yyyy-mm-dd',
					language: 'fr',
					startDate: "2015-01-01",
					endDate: "2015-10-31",
					autoclose: true,
					weekStart: 0
		};*/
	
    
	$scope.reset = function() { 
        $scope.user = "";
    };
    $scope.reset();
	
}]);
