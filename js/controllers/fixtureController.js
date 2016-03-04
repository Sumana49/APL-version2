var fixtureCtrl = function($scope,$http,http_defaults,$state,$rootScope,$cookieStore,$timeout,leaderBoard,AuthenticationService){
	AuthenticationService.clearMatchFixtureCredentials();
	$scope.getLeaderBoardTeamDetails = getLeaderBoardTeamDetails;
	$scope.getFixtures = getFixtures;
	$scope.lightSlider = lightSlider;
	$scope.getLeadingPlayers = getLeadingPlayers;
	$scope.viewPlayerDetails = viewPlayerDetails;
    $scope.showLeaderBoardCurrent = showLeaderBoardCurrent;
    $scope.showLeaderBoardOverall = showLeaderBoardOverall;
    $scope.getCurrentQuarter = getCurrentQuarter;
	$scope.dataLoading = false;
	$scope.showError = false;
    $scope.leaderBoard = true;
    $scope.overall = false;
	$scope.fixtureVenue = "";
	$scope.fixtureDate = "";
	var error = {
		SERVICE_FAILURE : "Something went wrong. Please try again in sometime"
	}
    function init(){
    	$scope.getFixtures();
		$scope.getLeadingPlayers();
        $scope.getCurrentQuarter();
	}  
	
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
	 
    // Get all Fixtures
    function getFixtures(){
		$scope.dataLoading = true;
        $http.get(URLBASE + "getFixtures",http_defaults).success(function(response, status, headers, config) {
			if(response.type == "success"){
				$scope.dataLoading = false;
				$scope.fixtureVenue = response.data[0].matchLocation;
				$scope.fixtureDate = response.data[0].matchDate;
				$scope.fixtureData = response.data;
			}
			else{
				$scope.dataLoading = false;
				$scope.fixtureVenue = "Location";
				$scope.fixtureDate = "Date";
				$scope.fixtureData = [];
			}
		}).error(function(response, status, headers, config) {
				errorDisplay(error.SERVICE_FAILURE);
		});
	};
	
	//Get Leading Players
	function getLeadingPlayers(){
		$http.get(URLBASE + "getLeadingPlayers").success(function(response, status, headers, config) {
			if(response.type == "success"){
				$scope.leadingPlayers = response.data;
			}
			else{
				$scope.leadingPlayers = [];
			}
			lightSlider();
		}).error(function(response, status, headers, config) {
				errorDisplay(error.SERVICE_FAILURE);
		});
	};
	function lightSlider(){
		var slider = $('#scroller-div').lightSlider({
			autoWidth: true,
			loop: true,
			cssEasing: 'ease',
			easing: 'linear',
			speed: 1000
		});
		slider.play();
	};
	
	//Page redirect
	function viewPlayerDetails(content){
		AuthenticationService.storeFixturesMatchDetails(content);
		$state.go('viewPlayerDetails');
	}
    init();
	$scope.closeError = function(){
		$scope.showError = false;		
	};
	
	$scope.inProgress = function(){
		$state.go('home');
	}
	
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
		leaderBoard.getLeaderBoard("all").then(function(data){
          $scope.leaderBoardContentAll = data; 
          $("#leaderBoardOverall").addClass("active");
        });
    };
    function showLeaderBoardCurrent(){
        $scope.overall = false;
        $scope.leaderBoard = true;
        $("#leaderBoardOverall").removeClass("active");
		leaderBoard.getLeaderBoard($scope.quarter).then(function(data){
          $scope.leaderBoardContent = data;
          $("#leaderBoardCurrent").addClass("active");  
        });
    };
}

