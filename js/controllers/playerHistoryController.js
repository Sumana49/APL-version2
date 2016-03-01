var playerHistoryCtrl = function($scope,$http,$state,$rootScope,$cookieStore,$stateParams,AuthenticationService,matchService,leaderBoard){
	$scope.getTeamPlayersHistory = getTeamPlayersHistory;
	$scope.getLeaderBoardTeamDetails = getLeaderBoardTeamDetails;
    $scope.showLeaderBoardCurrent = showLeaderBoardCurrent;
    $scope.showLeaderBoardOverall = showLeaderBoardOverall;
    $scope.getCurrentQuarter = getCurrentQuarter;
	$scope.dataLoading = false;
	$scope.showHeading = true;
	$scope.noHistory = false;
    $scope.leaderBoard = true;
    $scope.overall = false;
	var key;
	var error = {
		SERVICE_FAILURE : "Something went wrong. Please try again in sometime"
	}
    function init(){
		getTeamPlayersHistory();
        getCurrentQuarter();
    }
    init();
	
	//Function show error
	function errorDisplay(errorMessage){
		$('html, body').animate({
			scrollTop: $("body").offset().top
		}, 1000);
		$scope.showError = true;
		$scope.errorMessage = errorMessage;	
		 $timeout(function(){
             $scope.showError = false;
			 $scope.captain = "captain-logo";
         }, 5000);
	};
	
	// Get User Team
   	function getTeamPlayersHistory(){
		//var teamDetails = matchService.getMatchIdDetails();
		key = $stateParams.key;
		$scope.dataLoading = true;
        $http({method:'GET',url:URLBASE + "getTeamPlayersHistory",params:{teamId:$stateParams.teamId,matchId:$stateParams.matchId}}).success(function(response) {
			if(response.type == "success"){
				 if($stateParams.points != null && $stateParams.points != "")
				 	$scope.totalPoints = $stateParams.points;
				 else
					$scope.totalPoints = 0;
				$scope.noHistory = false;
			    $scope.showHeading = true;
                var data = response.data.teamDetails;
			    $scope.fantasyTeamHistory = data;
				if(data.length == 0){
					$scope.showHeading = false;
					$scope.noHistory = true;
				}
				 $scope.dataLoading = false;
            }else{
                $scope.fantasyTeamHistory = [];
				$scope.showHeading = false;
				$scope.noHistory = true;
				$scope.dataLoading = false;
            }
		}).error(function(response, status, headers, config) {
				errorDisplay(error.SERVICE_FAILURE);
		});
	};
	$scope.backToHistory =function(){
		if(key)
			$state.go('historyLeader');
		else	
			$state.go('history');
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
