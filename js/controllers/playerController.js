var playerCtrl = function($scope,$http,http_defaults,$state,$stateParams,AuthenticationService,$animate,$rootScope,$cookieStore,$timeout,leaderBoard){
	$scope.getUserTeamProfile = getUserTeamProfile;
	$scope.subView  = 'playerController';
	$scope.getUserFantasyTeam = getUserFantasyTeam;
	$scope.errorDisplay = errorDisplay;
	$scope.getLeaderBoardTeamDetails = getLeaderBoardTeamDetails;
	$scope.showError = false;
	$scope.dataLoading = false;
	$scope.transfersCount = false;
	$scope.showProfile = true;
	$scope.noHistory = false;
	$scope.analytics = analytics;    
    $scope.leaderBoard = true;
    $scope.overall = false;
    $scope.getCurrentQuarter = getCurrentQuarter;
    $scope.showLeaderBoardCurrent = showLeaderBoardCurrent;
    $scope.showLeaderBoardOverall = showLeaderBoardOverall;
    var fantastyTeamDetails = {};
	var error = {
		SERVICE_FAILURE : "Something went wrong. Please try again in sometime"
	};
    function init(){
		$rootScope.teamDetails = $cookieStore.get('teamDetails') || {};
		fantastyTeamDetails.teamId = $rootScope.teamDetails.teamId;
		fantastyTeamDetails.teamName = $rootScope.teamDetails.teamName;
		$scope.getUserTeamProfile();
		$scope.analytics();
        $scope.getCurrentQuarter();
    }
	function analytics(){
		var userId = $rootScope.teamDetails.userId;
		$http({method:'POST',url:URLBASE + "insertAnalytics",data:{userId:userId}}).success(function(response, status, headers, config) {	
			if(response.type == "success"){
			}
			}).error(function(response, status, headers, config) {
			});
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
	// Get User Team
   	function getUserFantasyTeam(){
        var teamId = fantastyTeamDetails.teamId;
        $http({method:'GET',url:URLBASE + "getUserFantasyTeam",params:{teamId:teamId}},http_defaults).success(function(response) {
			if(response.type == "success"){
				 $scope.dataLoading = false;
                 var data = response.data.teamDetails;
			     $scope.fantasyTeam = data;
				 $scope.dataLoading = false;
            }else{
                $scope.fantasyTeam = [];
				$scope.dataLoading = false;
                $scope.dataLoading = false;
            }
		}).error(function(response, status, headers, config) {
				errorDisplay(error.SERVICE_FAILURE);
		});
	};
    	// Get profile details
	function getUserTeamProfile(){
        var teamId = fantastyTeamDetails.teamId;
		$scope.dataLoading = true;
        $http({method:'GET',url:URLBASE + "getUserTeamProfile",params:{teamId:teamId}}).success(function(response, status) {
			if(response.type=="success"){
			     $scope.showProfile = true;
				 $scope.noHistory = false;
				 $scope.getUserFantasyTeam();
				 $scope.transfersCount = response.data.countTransfers;
			     $scope.teamProfile = response.data.profileDetails;
                 if($scope.teamProfile != null){
			         if($scope.teamProfile.rank == "Not rated yet")
				        $scope.teamProfile.rank = "-";
                 }else{
                     errorDisplay("There is no team profile to display, pls refresh!!");  
                 }
			}else{
               $scope.teamProfile = []; 
			   $scope.dataLoading = false;
			   $scope.showProfile = false;
			   $scope.noHistory = true;
            }
		}).error(function(response, status, headers, config) {
				errorDisplay(error.SERVICE_FAILURE);
		});
	};
	
    init();
	//Change Squad
	$scope.changeSquad = function(){
		$state.go('home');
	};
	$scope.closeError = function(){
		$scope.showError = false;		
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
}
