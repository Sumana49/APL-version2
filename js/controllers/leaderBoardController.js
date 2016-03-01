var leaderCtrl = function($scope,$http,$state,leaderBoard,$rootScope,$cookieStore,AuthenticationService){
	$scope.search = false;
    $scope.result = "current";
	$scope.showSearch = showSearch;
	$scope.hideSearch = hideSearch;
	$scope.getLeaderBoardTeamDetails = getLeaderBoardTeamDetails;
	$scope.getLeadingPlayers = getLeadingPlayers;
    $scope.getCurrentQuarter = getCurrentQuarter;
    $scope.showLeaderBoardOverall = showLeaderBoardOverall;
    $scope.showLeaderBoardCurrent = showLeaderBoardCurrent;
    function init(){
		$scope.dataLoading = true;
        getCurrentQuarter();
		getLeadingPlayers();
    };
     // Function get current quarter
    function getCurrentQuarter(){
        $http.get(URLBASE + "getCurrentQuarter").success(function(response) {
            $scope.quarter = response.data.quarterNo;
            showLeaderBoardCurrent();
        });
    };
	function showLeaderBoardOverall(){
        $scope.result = "overall";  
        $scope.dataLoading = true;
        $(".dim-opacity").addClass("opacity");
		leaderBoard.getLeaderBoard("all").then(function(data){
          $scope.dataLoading = false;
          $(".dim-opacity").removeClass("opacity");
          $scope.leaderBoardContent = data;  
        });
    };
    function showLeaderBoardCurrent(){
        $scope.dataLoading = true;
        $scope.result = "current";
        $(".dim-opacity").addClass("opacity");
		leaderBoard.getLeaderBoard($scope.quarter).then(function(data){
          $scope.dataLoading = false;
          $(".dim-opacity").removeClass("opacity");
          $scope.leaderBoardContent = data;  
        });
    };
	function getLeaderBoardTeamDetails(content){
		var teamId = content.teamId;
		var teamName = content.teamName;
		AuthenticationService.SetLeaderBoardTeamDetails(teamId,teamName);
		$rootScope.leaderBoardTeamDetails = $cookieStore.get('leaderBoardTeamDetails') || {};
		$state.go('historyLeader');
	};
    init();
	//Get Leading Players
	function getLeadingPlayers(){
		$http.get(URLBASE + "getLeadingPlayers").success(function(response, status, headers, config) {
			if(response.type == "success"){
				$scope.leadingPlayers = response.data;
			}
			else{
				$scope.leadingPlayers = [];
			}
		}).error(function(response, status, headers, config) {
				errorDisplay(error.SERVICE_FAILURE);
		});
	};
	function showSearch(){
		$scope.search = true;
	};
	function hideSearch(){
		$scope.search = false;
	};
}
