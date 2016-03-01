var forgotPasswordCtrl = function ($scope, $rootScope, $location, AuthenticationService, $http, http_defaults, $timeout) {   
    $scope.showError = false;
    $scope.errorDisplay = errorDisplay;
    $scope.dataLoading = false;
    var error = {
		SERVICE_FAILURE : "Something went wrong. Please try again in sometime",
        OTP_SUCCESS : "Kindly check your inbox"
	};
    function errorDisplay(errorMessage){
        $scope.dataLoading = false;
		$scope.showError = true;
		$scope.errorMessage = errorMessage;	
		 $timeout(function(){
             $scope.showError = false;
         }, 5000);
	};
    $scope.closeError = function(){
        $scope.showError = false;
    };
    $scope.login = function(){
        $scope.dataLoading = true;
        if($scope.username != undefined && $scope.username != null){ 
            $http({method:'POST',url:URLBASE + "forgotPassword",data:{email:$scope.username}},http_defaults).success(function(response, status, headers, config) {
            if(response.type == "success")
                errorDisplay(error.OTP_SUCCESS);
            else
                errorDisplay(response.message);
            }).error(function(response, status, headers, config) {
                errorDisplay(error.SERVICE_FAILURE);
			    $scope.dataLoading = false;
            });
        }
     }                                                                                                               
};
