var viewPlayerDetailsCtrl = function($scope,$http,$state,AuthenticationService,$animate,$rootScope,$cookieStore,$timeout,leaderBoard){
	$scope.viewPlayerDetails = viewPlayerDetails;
	$scope.getLeaderBoardTeamDetails = getLeaderBoardTeamDetails;
    $scope.showLeaderBoardCurrent = showLeaderBoardCurrent;
    $scope.showLeaderBoardOverall = showLeaderBoardOverall;
    $scope.getCurrentQuarter = getCurrentQuarter;
    $scope.leaderBoard = true;
    $scope.overall = false;
	$scope.players = [];
	$scope.remainingPlayers = [];
	$scope.dataLoading = false;
	var matchDetails;
	var error = {
		SERVICE_FAILURE : "Something went wrong. Please try again in sometime"
	}
	function init(){
		viewPlayerDetails();
        getCurrentQuarter();
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
	function getTeamName(teamId){
		if(teamId == 1)
			return "Hurricanes";
		if(teamId == 2)
			return "Scorchers";
		if(teamId == 3)
			return "Strikers";
		if(teamId == 4)
			return "Super Stars";
	}
	function viewPlayerDetails(){
		$rootScope.fixtureMatchDetails = $cookieStore.get('fixtureMatchDetails') || {};
		matchDetails = $rootScope.fixtureMatchDetails;
		$scope.dataLoading = true;
		if(matchDetails.matchResult != null && matchDetails.matchResult != "")
			$scope.matchResult = matchDetails.matchResult+"...  ";
		if(matchDetails.manOfTheMatch != null && matchDetails.manOfTheMatch != "")
			$scope.manOfTheMatch = "Man of the match : "+matchDetails.manOfTheMatch;
		if(matchDetails.teamOneId != null)
			$scope.teamOne = getTeamName(matchDetails.teamOneId);
		if(matchDetails.teamTwoId != null)
			$scope.teamTwo = getTeamName(matchDetails.teamTwoId);
		if(matchDetails.teamOneScore != null && matchDetails.teamOneScore != "")
			$scope.teamOneScore = "("+matchDetails.teamOneScore+")";
		if(matchDetails.teamTwoScore != null && matchDetails.teamTwoScore != "")
			$scope.teamTwoScore = "("+matchDetails.teamTwoScore+")";
		$http.get(URLBASE + "getPlayerPointsForTheMatch?matchId="+matchDetails.matchId).success(function(response, status, headers, config) {
			if(response.type == "success"){
				for(var i=0;i<response.data.length;i++){
					if(response.data[i].teamId == matchDetails.teamOneId){
						$scope.players.push(response.data[i]);
					}
					else if(response.data[i].teamId == matchDetails.teamTwoId)
						$scope.remainingPlayers.push(response.data[i]);
				}
			}
			$scope.dataLoading = false;
		}).error(function(response, status, headers, config) {
			$scope.dataLoading = false;
			errorDisplay(error.SERVICE_FAILURE);
		});
	};
	$scope.closeError = function(){
		$scope.showError = false;		
	};
	$scope.backToFixtures = function(){
		AuthenticationService.clearMatchFixtureCredentials();
		$state.go('fixtures');	
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
	init();
}