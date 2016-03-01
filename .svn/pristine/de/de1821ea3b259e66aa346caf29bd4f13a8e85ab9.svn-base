var homeCtrl = function($scope,$http,http_defaults,$state,AuthenticationService,$filter,$animate,$rootScope,$cookieStore,VideoControl,$timeout,leaderBoard){
	$scope.getAllAPLPlayers = getAllAPLPlayers;
    $scope.getFantasyTeamDetails = getFantasyTeamDetails;
	$scope.createFantasyTeam = createFantasyTeam;
	$scope.getUserFantasyTeam = getUserFantasyTeam;
	$scope.insertPlayerSelection = insertPlayerSelection;
    $scope.pauseVideo = pauseVideo;
	$scope.increamentTeamCount = increamentTeamCount;
	$scope.checkImpact = checkImpact;
	$scope.decrementTeamCount = decrementTeamCount;
	$scope.moneyLeftCalculation = moneyLeftCalculation;
	$scope.errorDisplay = errorDisplay;
	$scope.createTeamLinkVisibility = false;
    $scope.fantasyTeamVisibility = false;
	$scope.renameTeamLinkVisibility = false;
    $scope.showCreateTeamVisibility = false;
	$scope.dataLoading = false;
	$scope.showError = false;
	$scope.showArrow = false;
	$scope.transfersCount = false;
	$scope.createTeamButton = "Create Team";
	$scope.getFixtures = getFixtures;
	$scope.getLeadingPlayers = getLeadingPlayers;
	var fantasyTeamDetails, aplPlayers,getTeamDetailsFromService, resetAllAplPlayersList, resetTeamPlayersList, resetUserProfile;
	var originalPlayerList = [];
	var impactPlayerCount = 0, hurricanePlayerCount = 0, scochersPlayerCount = 0, superStarPlayerCount = 0, strikersPlayerCount = 0;
	$scope.filterCategory = {allrounder:false, bat:false, bowl:false, team1:false, team2:false, team3: false, team4: false, impact: false};
	var error = {
		MAX_HURRICANES_ERROR : "Maximum of only 5 Hurricanes players are allowed",
		MAX_SCORCHERS_ERROR : "Maximum of only 5 Scorchers players are allowed",
		MAX_STRIKERS_ERROR : "Maximum of only 5 Strikers players are allowed",
		MAX_SUPERSTARS_ERROR : "Maximum of only 5 Super Stars players are allowed",
		MAX_IMPACT_COUNT : "Maximum of only 3 impact players are allowed per team",
		MAX_TEAM_SIZE : "Maximum team size has been reached",
		TEAM_CAPTAIN : "Drag and drop the captain icon near your team captain",
		TEAM_SIZE : "Minimum of 11 players has to be selected",
		MONEY_EXCEEDED : "You have insufficient credits in your account",
		SERVICE_FAILURE : "Something went wrong. Please try again in sometime",
		TRANSFERS_EXCEEDED : "You have no transfers left",
        MATCH_LOCKED : "Match is locked!!. No more transfers allowed :( "
	}
	
	//Drag and drop
	$scope.list1 = {blob_url:"images/captain.png"};
	$scope.list2 = {};
	
	function init(){
		$scope.selectedPlayerList = [];
		$scope.finalSelectedPlayerList = [];
		$scope.getAllAPLPlayers();
        $scope.pauseVideo();
		$scope.getLeadingPlayers();
		$scope.getFixtures();
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
			 $scope.showArrow = false;
         }, 5000);
	};
	
	//IncreamentTeamCount
	function increamentTeamCount(aplTeamId){
		if(aplTeamId == 1)
			++hurricanePlayerCount;
		else if(aplTeamId == 2)
			++scochersPlayerCount;
		else if(aplTeamId == 3)
			++strikersPlayerCount;
		else if(aplTeamId == 4)
			++superStarPlayerCount;
	};
	
	//Decrement team count
	function decrementTeamCount(aplTeamId){
		if(aplTeamId == 1)
			--hurricanePlayerCount;
		else if(aplTeamId == 2)
			--scochersPlayerCount;
		else if(aplTeamId == 3)
			--strikersPlayerCount;
		else if(aplTeamId == 4)
			--superStarPlayerCount;
	}
    
	//Check Impact
	function checkImpact(impact){
		if(impact)
			--impactPlayerCount;
	}
	
    function pauseVideo(){
        VideoControl.pause();
    }
	
	//MoneyLeftCalculation
	function moneyLeftCalculation(){
	}
	
	$scope.redirectToPlayers = function(){
		$scope.insertPlayerSelection();
	};
	
	//Create fantasy team
	function createFantasyTeam(){
        $rootScope.teamDetails = $cookieStore.get('teamDetails') || {};
        var userId = $rootScope.teamDetails.userId;
		$scope.dataLoading = true;
		$http({method:'POST',url:URLBASE + "createFantasyTeam",data:{teamName:$scope.teamName,userId:userId}},http_defaults).success(function(response, status, headers, config) {
			if(response.type == "success"){
				fantasyTeamDetails = response.data;	
				$scope.userProfile = fantasyTeamDetails.teamDetails;
				$scope.fantasyTeamName = $scope.userProfile.teamName;
				if(fantasyTeamDetails.teamDetails.teamId != undefined && fantasyTeamDetails.teamDetails.teamId != null){
					$scope.createTeamLinkVisibility = false;
					$scope.renameTeamLinkVisibility = true;
					$scope.showCreateTeamVisibility = true;
				}
				AuthenticationService.SetTeamDetails(userId,fantasyTeamDetails.teamDetails.teamId,fantasyTeamDetails.teamDetails.teamName);
			}
			else{
				errorDisplay(response.message);
			}
			$scope.dataLoading = false;
		}).error(function(response, status, headers, config) {
            errorDisplay(error.SERVICE_FAILURE);
			$scope.dataLoading = false;
		});
	};
    
	$scope.keyPress = function(eventNew){
		if (eventNew.which==13)
    		createFantasyTeam();
	}
	
    // Get Fantasy Team Details
    function getFantasyTeamDetails(){
        $rootScope.teamDetails = $cookieStore.get('teamDetails') || {};
        var teamId = $rootScope.teamDetails.teamId || "";
        if (teamId != "") {
            $scope.fantasyTeamVisibility = true;   
            $scope.createTeamLinkVisibility = false;
            $scope.fantasyTeamName = $rootScope.teamDetails.teamName;
            $scope.showCreateTeamVisibility = true;
            $scope.getUserFantasyTeam(teamId);
            
        }else{
            $scope.createTeamLinkVisibility = true;
            $scope.fantasyTeamVisibility = false;
        }
    }
    //Get team players
    function getUserFantasyTeam(teamId){
        $http.get(URLBASE + "getUserFantasyTeam?teamId="+teamId,http_defaults).success(function(response) {
            if(response.type == "success"){
				var data = response.data.teamDetails;
				originalPlayerList = data;
				for(var i=0; i<data.length; i++){
					var playerObj = {};
					playerObj["selectedPlayerList"] = data[i];
					if($scope.AplPlayers.length > 0){
						for(var j=0; j<$scope.AplPlayers.length; j++){
							if(playerObj["selectedPlayerList"].playerId == $scope.AplPlayers[j].playerId){
								var index = $scope.AplPlayers.indexOf($scope.AplPlayers[j]);
								$scope.AplPlayers.splice(index,1);     
							}
						}
					}
					if(data[i].isCaptain){
						playerObj["list2"] = {blob_url:"images/captain.png"};
						$scope.list1 = {};
					}
					else
						playerObj["list2"] = {};
					if(data[i].isImpact)
						++impactPlayerCount;
					increamentTeamCount(data[i].playerAplTeamId);
					$scope.finalSelectedPlayerList.push(playerObj);
				}
				 $scope.transfersCount = response.data.countTransfers;
                 $scope.userProfile = response.data.profileDetails;
            }else{
                 $scope.finalSelectedPlayerList = [];  
                 $scope.userProfile = [];
            }
			resetAllAplPlayersList = angular.copy($scope.AplPlayers);
			resetTeamPlayersList = angular.copy($scope.finalSelectedPlayerList);
			resetUserProfile = angular.copy($scope.userProfile);
		}).error(function(response, status, headers, config) {
				errorDisplay(error.SERVICE_FAILURE);
		});
       
	};

	// Get all APL Players
    function getAllAPLPlayers(){
		$scope.dataLoading = true;
        $http.get(URLBASE + "getAllAPLPlayers",http_defaults).success(function(response, status, headers, config) {
			if(response.type == "success"){
				$scope.AplPlayers = response.data.players;
        		$scope.getFantasyTeamDetails();
			}
			else
				$scope.AplPlayers = [];
			$scope.dataLoading = false;
		}).error(function(response, status, headers, config) {
				errorDisplay(error.SERVICE_FAILURE);
		});
	};
	
	//Insert APL Players
	
	function insertPlayerSelection(){  
		var flag = false;
		var insertPlayerList = [];
        $rootScope.teamDetails = $cookieStore.get('teamDetails') || {};
        var userId = $rootScope.teamDetails.userId;
        var teamId = $rootScope.teamDetails.teamId;
		var selectedList = $scope.finalSelectedPlayerList;
		if(selectedList.length == 11){
			for(var i=0; i < selectedList.length;i++){
				var playerObj = {};
				playerObj["playerId"] = selectedList[i].selectedPlayerList.playerId;
				if(selectedList[i].list2.blob_url != undefined && selectedList[i].list2.blob_url == "images/captain.png"){
					playerObj["isCaptain"] = 1;
					flag = true;
				}
				else
					playerObj["isCaptain"] = 0;
				insertPlayerList.push(playerObj);
			}
			if(flag){	
				$scope.dataLoading = true;
				$(".create-team").addClass("opacity");
				$scope.showArrow = false;
				$http({method:'POST',url:URLBASE + "insertPlayerSelection",data:{userId:userId,teamId:teamId,players:JSON.stringify(insertPlayerList)}}).success(function(response, status, headers, config) {	
				if(response.type == "success")
					$state.go('players');
                else{
                    errorDisplay(response.message);
                    $scope.dataLoading = false;
					$(".create-team").removeClass("opacity");
                }
				}).error(function(response, status, headers, config) {
					errorDisplay(error.SERVICE_FAILURE);		
					$scope.dataLoading = false;
					$(".create-team").removeClass("opacity");
				});
			}
			else{
				$scope.showArrow = true;
				errorDisplay(error.TEAM_CAPTAIN);
			}
		}
		else
			errorDisplay(error.TEAM_SIZE);
	};
	
	
	//UI player selction
    $scope.rosterListener = function(player){
		if($scope.userProfile.transfersLeft > 0){
			var moneyLeft = $scope.userProfile.moneyLeft - player.playerPrice;
			if(player.isImpact)
				++impactPlayerCount;
			increamentTeamCount(player.playerAplTeamId);
			if($scope.finalSelectedPlayerList.length>=11){
				decrementTeamCount(player.playerAplTeamId);
				checkImpact(player.isImpact);
				errorDisplay(error.MAX_TEAM_SIZE);
			}
			else if(impactPlayerCount > 3){
				--impactPlayerCount;
				decrementTeamCount(player.playerAplTeamId);
				errorDisplay(error.MAX_IMPACT_COUNT);
			}
			else if(hurricanePlayerCount > 5){
				--hurricanePlayerCount;
				checkImpact(player.isImpact);
				errorDisplay(error.MAX_HURRICANES_ERROR);
			}
			else if(scochersPlayerCount > 5){
				--scochersPlayerCount;
				checkImpact(player.isImpact);
				errorDisplay(error.MAX_SCORCHERS_ERROR);
			}
			else if(strikersPlayerCount > 5){
				--strikersPlayerCount;
				checkImpact(player.isImpact);
				errorDisplay(error.MAX_STRIKERS_ERROR);
			}
			else if(superStarPlayerCount > 5){
				--superStarPlayerCount;
				checkImpact(player.isImpact);
				errorDisplay(error.MAX_SUPERSTARS_ERROR);
			}
			else if(moneyLeft < 0){
				decrementTeamCount(player.playerAplTeamId);
				checkImpact(player.isImpact);
				errorDisplay(error.MONEY_EXCEEDED);
			}
			else{
				var playerObj = {};
				playerObj["selectedPlayerList"] = player;
				playerObj["list2"] = {};
				$scope.finalSelectedPlayerList.push(playerObj);
				$scope.userProfile.moneyLeft = $scope.userProfile.moneyLeft - player.playerPrice;

				//Transfer calculation
				if($scope.transfersCount){
					if(originalPlayerList.indexOf(player) == -1){
						$scope.userProfile.transfersLeft = $scope.userProfile.transfersLeft - 1;	
					}
				}
				var index = $scope.AplPlayers.indexOf(player);
				$scope.AplPlayers.splice(index,1);    
			}
		}
		else
			errorDisplay(error.TRANSFERS_EXCEEDED);
	};
    
	$scope.yourTeamListener = function(selectedPlayer){
		if(selectedPlayer.list2.blob_url !=undefined && selectedPlayer.list2.blob_url != ""){
			selectedPlayer.list2 = {};
			$scope.list1 = {blob_url:"images/captain.png"};	
		}
		if ($scope.AplPlayers.indexOf(selectedPlayer.selectedPlayerList) == -1) {
			if(selectedPlayer.selectedPlayerList.isImpact)
				--impactPlayerCount;
			decrementTeamCount(selectedPlayer.selectedPlayerList.playerAplTeamId);
			$scope.AplPlayers.push((selectedPlayer.selectedPlayerList)); 
			$scope.userProfile.moneyLeft = $scope.userProfile.moneyLeft + selectedPlayer.selectedPlayerList.playerPrice;
			var index = $scope.finalSelectedPlayerList.indexOf(selectedPlayer);
			$scope.finalSelectedPlayerList.splice(index,1); 
			//Transfer calculation
			if($scope.transfersCount){
				if(originalPlayerList.indexOf(selectedPlayer.selectedPlayerList) == -1){
					$scope.userProfile.transfersLeft = $scope.userProfile.transfersLeft + 1;	
				}
			}
		}         
	};
	init();
	
	$scope.resetPlayers = function(){
		impactPlayerCount = 0; hurricanePlayerCount = 0; scochersPlayerCount = 0; superStarPlayerCount = 0; strikersPlayerCount = 0;
		for(var i=0; i < resetTeamPlayersList.length; i++){
			if(resetTeamPlayersList[i].selectedPlayerList.isCaptain){
				$scope.list1 = {};
			}
			if(resetTeamPlayersList[i].selectedPlayerList.isImpact)
				++impactPlayerCount;
			increamentTeamCount(resetTeamPlayersList[i].selectedPlayerList.playerAplTeamId);
		}
		$scope.finalSelectedPlayerList = angular.copy(resetTeamPlayersList);
		$scope.AplPlayers = angular.copy(resetAllAplPlayersList);
		$scope.userProfile = angular.copy(resetUserProfile);

	};
	$scope.closeError = function(){
		$scope.showError = false;		
		$scope.showArrow = false;
	};
	$scope.backToHome = function(){
		$state.go('players');
	};
	
	//Get Leading Players
	function getLeadingPlayers(){
		$http.get(URLBASE + "getPopularPlayers",http_defaults).success(function(response, status, headers, config) {
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
	function getTeamName(teamId){
		if(teamId == 1)
			return "Hurricanes";
		if(teamId == 2)
			return "Scorchers";
		if(teamId == 3)
			return "Strikers";
		if(teamId == 4)
			return "Super Stars";
	};
	//Get fixtures
	function getFixtures(){
        $http.get(URLBASE + "getFixtures",http_defaults).success(function(response, status, headers, config) {
			if(response.type == "success"){
				$scope.dataLoading = false;
				$scope.fixtureData = response.data;
			}
			else{
				$scope.dataLoading = false;
				$scope.fixtureData = [];
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
	
}