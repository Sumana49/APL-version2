var historyCtrl = function($scope,$http,$state,$rootScope,$cookieStore,$stateParams,AuthenticationService,matchService,leaderBoard,$timeout){
	$scope.showHeading = true;
	$scope.getRecentMatchHistory = getRecentMatchHistory;
	$scope.getLeaderBoardCredentials = getLeaderBoardCredentials;
	$scope.getLeaderBoardTeamDetails = getLeaderBoardTeamDetails;
	$scope.getCurrentMatchData = getCurrentMatchData;
    $scope.showLeaderBoardCurrent = showLeaderBoardCurrent;
    $scope.showLeaderBoardOverall = showLeaderBoardOverall;
    $scope.getCurrentQuarter = getCurrentQuarter;
	$scope.dataLoading = false;
	$scope.isFromLeaderBoard = false;
	$scope.noHistory = false;
    $scope.leaderBoard = true;
    $scope.overall = false;
    $scope.quarter = 0;
    $scope.showSvg = false;
	var leaderBoardCredentials,teamId,key;
	var noHistoryFlag = false;
	var error = {
		SERVICE_FAILURE : "Something went wrong. Please try again in sometime",
        NOT_STARTED : "Quarter not yet started"
	}
    function init(){
        getCurrentQuarter();
    }
    init();
    
    // Function get current quarter
    function getCurrentQuarter(){
        $http.get(URLBASE + "getCurrentQuarter").success(function(response) {
            $scope.quarter = response.data.quarterNo;
		    getRecentMatchHistory($scope.quarter);
            $scope.result = $scope.quarter;
            $scope.showLeaderBoardCurrent();
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
	function getLeaderBoardCredentials(){
		$rootScope.leaderBoardTeamDetails = $cookieStore.get('leaderBoardTeamDetails') || {};
		leaderBoardCredentials = $rootScope.leaderBoardTeamDetails;
	}
	
	function getRecentMatchHistory(quarterId){
		getLeaderBoardCredentials();
        $scope.result = quarterId;
		if(Object.keys(leaderBoardCredentials).length == 0){
			$rootScope.teamDetails = $cookieStore.get('teamDetails') || {};
        	teamId = $rootScope.teamDetails.teamId || "";
			$scope.teamName = $rootScope.teamDetails.teamName || "";
			key = false;
		}
		else{
			teamId = leaderBoardCredentials.teamId;
			$scope.teamName = leaderBoardCredentials.teamName || "";
			$scope.isFromLeaderBoard = true;
			key = true;
		}
		$scope.dataLoading = true;
        $(".add-opacity").addClass("opacity");
        if(quarterId <= $scope.quarter){
            $scope.showSvg = false;
            $http.get(URLBASE + "getRecentMatchHistory?teamId="+teamId+"&quarterId="+quarterId).success(function(response) {
                if(response.type == "success"){
                    $scope.showHeading = true;
                    $scope.noHistory = false;
                    $scope.historyData = response.data;
                    $scope.dataLoading = false;
                    $(".add-opacity").removeClass("opacity");
                    if(response.data.length == 0){
                        noHistoryFlag = true;
                        $scope.noHistory = true;
                        $scope.showHeading = false;
                    }
                }
                else{
                    $scope.historyData = [];
                    $scope.dataLoading = false;
                    $(".add-opacity").removeClass("opacity");
                    $scope.noHistory = true;
                    $scope.showHeading = false;
                }
            }).error(function(response, status, headers, config) {
                    errorDisplay(error.SERVICE_FAILURE);
            });
        }
        else{
            $scope.historyData = [];
            $scope.dataLoading = false;
            $(".add-opacity").removeClass("opacity");
            $scope.noHistory = false;
            $scope.showSvg = true;
        }
	};
	function getCurrentMatchData(noHistoryFlag){
		$http.get(URLBASE + "getCurrentMatchDetails").success(function(response) {
            if(response.type == "success"){
				$scope.currentMatachData = response.data;
				//$scope.noHistory = false;
				//$scope.showHeading = true;
				if(noHistoryFlag && response.data.length == 0){
					$scope.noHistory = true;
					$scope.showHeading = false;
				}
			}
			else{
				$scope.currentMatachData = [];
			}
		}).error(function(response, status, headers, config) {
				errorDisplay(error.SERVICE_FAILURE);
		});
	};
	$scope.viewPlayerHistory = function(content){
		//matchService.putMatchIdDetails(content.matchId,teamId,key);
		$state.go('playerHistory',{matchId:content.matchId,teamId:teamId,key:key,points:content.points});
	};
	$scope.backToLeaderBoard = function(){
		AuthenticationService.clearLeaderBoardCredentials();
		$state.go('leaderBoard');
	}
	$scope.closeError = function(){
		$scope.showError = false;		
	};	
	function getLeaderBoardTeamDetails(content){
		var teamId = content.teamId;
		var teamName = content.teamName;
		AuthenticationService.SetLeaderBoardTeamDetails(teamId,teamName);
		$rootScope.leaderBoardTeamDetails = $cookieStore.get('leaderBoardTeamDetails') || {};
		$state.go('historyLeader',{teamId:teamId});
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