var resetPasswordCtrl = function ($scope, $rootScope, $location, AuthenticationService,$http,http_defaults,$timeout,$stateParams,$state) {  
    console.log("inside");
    $scope.checkConfirmPassword = checkConfirmPassword;
    $scope.dataLoading = false;
    if($stateParams.email != null)
        var email = $stateParams.email;
    if($stateParams.otp != null)
        var otp = $stateParams.otp;
    var error = {
		SERVICE_FAILURE : "Something went wrong. Please try again in sometime",
        SUCCESS : "Password has been reseted successfully"
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
    $scope.resetPassword = function(){
        if($scope.password == $scope.confirmPassword && $scope.password != null && $scope.password != "" && $scope.password != undefined){
            $scope.dataLoading = true;
            $http({method:'POST',url:URLBASE + "resetPassword",data:{password:$scope.password,email:email,otp:otp}},http_defaults).success(function(response, status, headers, config) {
                if(response.type == "success"){
                    errorDisplay(error.SUCCESS);
                    $state.go('login');
                }
                else
                    errorDisplay(response.message);
                }).error(function(response, status, headers, config) {
                    errorDisplay(error.SERVICE_FAILURE);
                    $scope.dataLoading = false;
                });
        }
    };
    function checkConfirmPassword(){
        if($scope.password == $scope.confirmPassword)
            $scope.result = "success";
        else
            $scope.result = "error";
    }
};
