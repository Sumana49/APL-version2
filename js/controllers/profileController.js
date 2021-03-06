var profileCtrl = function ($scope,$http,$state,$rootScope,$cookieStore,$timeout,AuthenticationService,leaderBoard) {
	$scope.getFantasyTeamDetails = getFantasyTeamDetails;
	$scope.getLeaderBoardTeamDetails = getLeaderBoardTeamDetails;
	$scope.getUserId = getUserId;
	$scope.renameTeamLink = false;
	$scope.showTeamName = true;
	$scope.showPassword = true;
	$scope.renameTeam = renameTeam;
	$scope.resetPassword = resetPassword;
    $scope.showLeaderBoardCurrent = showLeaderBoardCurrent;
    $scope.showLeaderBoardOverall = showLeaderBoardOverall;
    $scope.getCurrentQuarter = getCurrentQuarter;
    $scope.checkConfirmPassword = checkConfirmPassword;
    $scope.leaderBoard = true;
    $scope.overall = false;
	var userId;
    var userName;
	var error = {
		SUCCESS:"Password has been changed successfully",
		SERVICE_FAILURE:"Something went wrong please try again in some time",
        PASSWORD_MISMATCH:"Password and Confirm Password fields mismatch"
	}
	function init(){
		getFantasyTeamDetails();
        getCurrentQuarter();
		getUserId();
	};
	
	//Function show error
	function errorDisplay(errorMessage){
		$('html, body').animate({
			scrollTop: $("body").offset().top
		}, 1000);
		$scope.showError = true;
		$scope.errorMessage = errorMessage;	
		 $timeout(function(){
             $scope.showError = false;
         }, 5000);
	};
	$scope.closeError = function(){
		$scope.showError = false;		
	};
	
	function getUserId(){
        userId = $rootScope.teamDetails.userId;
        if($rootScope.globals != null){
            userName = $rootScope.globals.currentUser.username;
            $scope.displayName = $rootScope.globals.currentUser.displayName;  
        }
	};
	function getFantasyTeamDetails(){
        $rootScope.teamDetails = $cookieStore.get('teamDetails') || {};
		$scope.teamName = $rootScope.teamDetails.teamName;
	};
	$scope.picUrl = "../images/man.jpg";
	$scope.teamProfilePic = "../images/man.jpg";
	$scope.checker = function(){
		console.log("$scope.picUrl",$scope.picUrl);
		$scope.profilePic = $scope.picUrl;
	};
	$scope.triggerFile = function(){
		$("input[type=file]").click();
	};
	$scope.enableRename = function(){
		$scope.renameTeamLink = true;
		$scope.showTeamName = false;
	};
	//Rename fantasy team
	function renameTeam(){
		var teamId = $rootScope.teamDetails.teamId;
		if($scope.teamName != undefined && $scope.teamName != ""){
			$http({method:'POST',url:URLBASE + "renameFantasyTeam",data:{teamId:teamId,userId:userId,teamName:$scope.teamName}}).success(function(response, status, headers, config) {
				if(response.type == "success"){
					$scope.renameTeamLink = false;
					$scope.showTeamName = true;
					AuthenticationService.SetTeamDetails(userId,teamId,$scope.teamName);
				}
				else{
					errorDisplay(response.message);
				}
			}).error(function(response, status, headers, config) {
				console.log("Failed getFantasyTeam Service call");
				errorDisplay(error.SERVICE_FAILURE);	
			});
		}
		else
			errorDisplay("Please enter a valid team name");
	};
	//Rename fantasy team
	function resetPassword(){
        if($scope.newPassword == $scope.confirmPassword){
          	$http({method:'POST',url:URLBASE + "changePassword",data:{oldPass:$scope.oldPassword,newPass:$scope.newPassword,userId:userId,email:userName}}).success(function(response, status, headers, config) {
            console.log("response",response);
			if(response.type == "success"){
				errorDisplay(error.SUCCESS);
				$scope.renamePasswordLink = false;
				$scope.showPassword = true;
			}
			else
				errorDisplay("You have entered invalid data");
			}).error(function(response, status, headers, config) {
				errorDisplay(error.SERVICE_FAILURE);	
			});  
        }
        else
            errorDisplay(error.PASSWORD_MISMATCH);
	};
	$scope.keyPress = function(eventNew){
		if (eventNew.which==13)
    		renameTeam();
	};
	$scope.keyPressPassword = function(eventNew){
		if (eventNew.which==13)
    		resetPassword();
	};
	
	function getLeaderBoardTeamDetails(content){
		var teamId = content.teamId;
		var teamName = content.teamName;
		AuthenticationService.SetLeaderBoardTeamDetails(teamId,teamName);
		$rootScope.leaderBoardTeamDetails = $cookieStore.get('leaderBoardTeamDetails') || {};
		$state.go('historyLeader');
	};
    function getCurrentQuarter(){
        $http.get(URLBASE + "getCurrentQuarter").success(function(response) {
            $scope.quarter = response.data.quarterNo;
            $scope.showLeaderBoardCurrent();
        });
    };
    function showLeaderBoardOverall(){
        $scope.leaderBoard = false;
        $scope.overall = true;
        $("#leaderBoardCurrent").removeClass("active");
        $("#leaderBoardOverall").addClass("active");
		leaderBoard.getLeaderBoard("all").then(function(data){
          $scope.leaderBoardContent = data;  
        });
    };
    function showLeaderBoardCurrent(){
        $scope.overall = false;
        $scope.leaderBoard = true;
        $("#leaderBoardOverall").removeClass("active");
        $("#leaderBoardCurrent").addClass("active");
		leaderBoard.getLeaderBoard($scope.quarter).then(function(data){
          $scope.leaderBoardContent = data;  
        });
    };
    function checkConfirmPassword(){
        if($scope.newPassword == $scope.confirmPassword)
            $scope.result = "success";
        else
            $scope.result = "error";
    };
	init();
};
