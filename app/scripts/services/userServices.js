
app.factory("userServices", ['$http', '$q', function($http, $q){
	var userJsonData = [];
	return {
		authUser: function(){
			userJsonData = ({firstname:"Varsha", lastname:"Tyagi", doj: '1382812200000'});
			return userJsonData;
		},
		getProperty: function() {
      return userJsonData;
    }
	
}]);
