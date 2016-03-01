var indexController = function($scope,$http,$state,leaderBoard,VideoControl,$timeout,AuthenticationService,$rootScope,$cookieStore){	
    $scope.videoPause = true;
	$scope.videoMute = true;
    $scope.playVideo = playVideo;
    $scope.pauseVideo = pauseVideo;    
    $scope.muteVideo = muteVideo;
    $scope.unmuteVideo = unmuteVideo;
	$scope.showLogoutOptions = false;
    function init(){
		$scope.headerOnscroll = true;
    }
	$scope.clearHistory = function(){
		AuthenticationService.clearLeaderBoardCredentials();
		/*leaderBoard.getRecentMatchHistory().then(function(data){
			console.log("data",data);
          $scope.historyData = data;  
        });*/
	}
    init();
    function playVideo(){
        VideoControl.play();
		$scope.videoPause = true;
		$scope.videoPlay = false;
    };
    function pauseVideo(){
        VideoControl.pause();
		$scope.videoPause = false;
		$scope.videoPlay = true;
    };
    function muteVideo(){
		VideoControl.mute();
		$scope.videoMute = false;
		$scope.videoUnmute = true;
	};
	function unmuteVideo(){
		VideoControl.unmute();
		$scope.videoMute = true;
		$scope.videoUnmute = false;
	};
	$scope.showLogoutMenu = function(){
		$scope.showLogoutOptions = true;
		$rootScope.globals = $cookieStore.get('globals') || {};
		if(Object.keys($rootScope.globals).length > 0){
			if($rootScope.globals.currentUser.displayName != undefined && $rootScope.globals.currentUser.displayName != null && $rootScope.globals.currentUser.displayName != "")
				$scope.userName = $rootScope.globals.currentUser.displayName;
			else{
				var userName = $rootScope.globals.currentUser.username;
				userName = userName.substring(0, userName.indexOf('@'));
				$scope.userName = userName;
			}
		}
		 $timeout(function(){
             $scope.showLogoutOptions = false;
         }, 3000);
	};
	
};