app.factory("UserService", ['$http', '$q', function($http, $q){
	var userJsonData = [];
	return {
	authUser: function(user){
			var q = $q.defer();
  		$http({
				method: 'POST',
				url: 'http://time-tracker-backend-app.herokuapp.com/Tracker/rest/employee/login',
        data: user
			}).success(function(response){
				console.log(response);
				q.resolve(response);
			}).
			error(function(response){
				q.reject(response);
			});
			return q.promise;
			//userJsonData = ({firstname:"Varsha", lastname:"Tyagi", doj: '1382812200000'});
			//return userJsonData;
		},

		getProperty: function() {
	      return userJsonData;
	    },

    emailme: function(userObj){
  		var q = $q.defer();
  		$http({
				method: 'POST',
				url: 'http://time-tracker-backend-app.herokuapp.com/Tracker/rest/employee/mailExcelSheet',
        data: userObj.dataobj,
        headers : userObj.header
			}).success(function(response){
				console.log(response);
				q.resolve(response);
			}).
			error(function(response){
				q.reject(response);
			});
			return q.promise;
  	},

  	registerUser: function(userObj) {
		var q = $q.defer();
		$http({
			method: 'POST',
			url: 'http://time-tracker-backend-app.herokuapp.com/Tracker/rest/employee/register',
	      	data: userObj,
	      	crossDomain:true,
	      	withCredentials: true,
	      	headers : {
		    	 'Content-Type': 'application/x-www-form-urlencoded'
		    }
		}).success(function(response){
			console.log(response);
			q.resolve(response);
		}).
		error(function(response){
			q.reject(response);
		});
		return q.promise;
	},
	forgotPassword: function(email) {
		var q = $q.defer();
		$http({
			method: 'POST',
			url: 'http://time-tracker-backend-app.herokuapp.com/Tracker/rest/employee/register',
	      	data: email,
	      	crossDomain:true,
	      	withCredentials: true,
	      	headers : {
		    	 'Content-Type': 'application/x-www-form-urlencoded'
			    }
			}).success(function(response){
				console.log(response);
				q.resolve(response);
			}).
			error(function(response){
				q.reject(response);
			});
			return q.promise;
 	}

  };

}]);
