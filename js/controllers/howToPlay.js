var howToPlayCtrl = function ($scope,$http,$state, $rootScope, $cookieStore, AuthenticationService,$timeout,$stateParams) {   
	$scope.showError = false;
	var error = {
		SERVICE_FAILURE : "Something went wrong. Please try again in sometime",
		SUCCESS:"Thank you for your feedback",
		REQUIRED_ERROR:"Please fill out the feedback field"
	}
	
	//Function show error
	function errorDisplay(errorMessage){
		$scope.showError = true;
		$scope.errorMessage = errorMessage;	
		 $timeout(function(){
             $scope.showError = false;
         }, 5000);
	};
	 
	$scope.saveFeedBack = function(){
		$rootScope.globals = $cookieStore.get('globals') || {};
        var userName = $rootScope.globals.currentUser.username;
		if($scope.feedBack != undefined && $scope.feedBack != ""){
			$http({method:'POST',url:URLBASE + "postFeedback",data:{name:userName,comments:$scope.feedBack,mailId:userName}}).success(function(response, status, headers, config) {
				if(response.type == "success"){
					errorDisplay(error.SUCCESS);
				}
			}).error(function(response, status, headers, config) {
				errorDisplay(error.SERVICE_FAILURE);
			});
		}
		else
			errorDisplay(error.REQUIRED_ERROR);
	};
	$scope.closeError = function(){
		$scope.showError = false;		
	};
	$scope.tour = function(){
		$state.go('tour',{key:true});
	};
}