
// Controller Registration

// Initial screen controller
aplapp.controller("indexController",['$scope','$http','$state','leaderBoard','VideoControl','$timeout', 'AuthenticationService','$rootScope', '$cookieStore', indexController]);

// LeaderBoard Controller
aplapp.controller("leaderController",['$scope','$http','$state','leaderBoard','$rootScope', '$cookieStore', 'AuthenticationService',leaderCtrl]);

// Home Controller
aplapp.controller("homeController",['$scope','$http','http_defaults','$state','AuthenticationService','$filter','$animate', '$rootScope', '$cookieStore', 'VideoControl','$timeout','leaderBoard', homeCtrl]);

// Player Controller
aplapp.controller("playerController",['$scope','$http','http_defaults','$state','$stateParams','AuthenticationService','$animate', '$rootScope', '$cookieStore','$timeout','leaderBoard', playerCtrl]);


// View  Player Details Controller
aplapp.controller("viewPlayerDetailsController",['$scope','$http','$state','AuthenticationService','$animate', '$rootScope', '$cookieStore','$timeout','leaderBoard', viewPlayerDetailsCtrl]);


// Fixture Controller
aplapp.controller("fixtureController",['$scope','$http','http_defaults','$state','$rootScope','$cookieStore','$timeout','leaderBoard','AuthenticationService', fixtureCtrl]);

// How to play Controller
aplapp.controller("howToPlay",['$scope','$http','$state', '$rootScope', '$cookieStore', 'AuthenticationService','$timeout','$stateParams', howToPlayCtrl]);

// Tour Controller
aplapp.controller("tourController",['$scope','$http','$state', '$rootScope', '$cookieStore','$stateParams', tourCtrl]);

// Login Controller
aplapp.controller("loginController",['$scope','$state', '$rootScope', '$location', 'AuthenticationService', loginCtrl]);

// Forgot Password Controller
aplapp.controller("forgotPasswordController",['$scope', '$rootScope', '$location', 'AuthenticationService','$http','http_defaults','$timeout','$stateParams', forgotPasswordCtrl]);

// Reset Password Controller
aplapp.controller("resetPasswordController",['$scope', '$rootScope', '$location', 'AuthenticationService','$http','http_defaults','$timeout','$stateParams','$state', resetPasswordCtrl]);

// Register Controller
aplapp.controller("registerController",['$scope', '$rootScope', '$location', 'AuthenticationService', registerCtrl]);

// Profile Controller
aplapp.controller("profileController",['$scope','$http','$state','$rootScope','$cookieStore','$timeout', 'AuthenticationService','leaderBoard', profileCtrl]);

// History Controller
aplapp.controller("historyController",['$scope','$http','$state','$rootScope','$cookieStore','$stateParams', 'AuthenticationService','matchService','leaderBoard','$timeout', historyCtrl]);

// Player History Controller
aplapp.controller("playerHistoryController",['$scope','$http','$state','$rootScope','$cookieStore','$stateParams', 'AuthenticationService','matchService','leaderBoard', playerHistoryCtrl]);
 aplapp.value('http_defaults', {
    timeout: 10000
  });
aplapp
  .config(function($httpProvider){
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.interceptors.push(['$q', '$location','$cookieStore','$rootScope', function($q, $location,$cookieStore,$rootScope) {
            return {
                'request': function (config) {
                    $rootScope.authToken = $cookieStore.get('authToken') || {};
                    var token = $rootScope.authToken.authToken;
                    config.headers = config.headers || {};
                    if (token) {
                        config.headers.Authorization = 'Bearer ' + token;
                    }
                    return config;
                },
                'responseError': function(response) {
                    if(response.status === 401 || response.status === 403) {
                        $location.path('/');
                    }
                    return $q.reject(response);
                }
            };
        }]); 
});
                                     

aplapp.filter('playerFilter', function () {
	function checkCategories(specification,team,type,impact){
		var flag = false;
		if(specification.allrounder || specification.bat || specification.bowl){
			if(type == specification.allrounder || type == specification.bat || type == specification.bowl){
				if(specification.impact){
					if(impact && specification.impact)
						flag = true;
				}
				else
					flag = true;
			}
		}
		else{
			if(specification.impact){
				if(impact && specification.impact)
					flag = true;
			}
			else
				flag = true;
		}
		return flag;
	};
	function checkCategoriesType(specification,team,type,impact){
		var flag = false;
		if(specification.team1 || specification.team2 || specification.team3 || specification.team4){
				if(team == specification.team1 || team == specification.team2 || team == specification.team3 || team == specification.team4){
					flag = true;
				}
			}
			else{
				flag = true;
			}
		return flag;
	}
	function playerSpecification(type,team,impact,filterCategory){
		var flag = false;
		var specification = {allrounder:false, bat:false, bowl:false, team1:false, team2:false, team3: false, team4: false, impact: false};
		if(filterCategory.allrounder)
			specification.allrounder = APL.FILTER_ALL;
		if(filterCategory.bat)
			specification.bat = APL.FILTER_BAT;
		if(filterCategory.bowl)
			specification.bowl = APL.FILTER_BOWL;
		
		if(filterCategory.team1)
			specification.team1 = APL.FILTER_TEAM1;
		if(filterCategory.team2)
			specification.team2 = APL.FILTER_TEAM2;
		if(filterCategory.team3)
			specification.team3 = APL.FILTER_TEAM3;
		if(filterCategory.team4)
			specification.team4 = APL.FILTER_TEAM4;
		
		if(filterCategory.impact)
			specification.impact = APL.FILTER_IMPACT;
		
		if(type == specification.allrounder){
			flag = checkCategoriesType(specification,team,type,impact);
		}
		else if(type == specification.bat){
			flag = checkCategoriesType(specification,team,type,impact);
		}
		else if(type == specification.bowl){
			flag = checkCategoriesType(specification,team,type,impact);
		}
		if(impact && specification.impact){
			if(specification.team1 || specification.team2 || specification.team3 || specification.team4){
				if(team == specification.team1 || team == specification.team2 || team == specification.team3 || team == specification.team4){
					flag = true;
				}
			}
			else{
				flag = true;
			}
		}
		if(flag){
			return flag;
		}
		else{
			if(team == specification.team1){
				flag = checkCategories(specification,team,type,impact);
			}
			else if(team == specification.team2){
				flag = checkCategories(specification,team,type,impact);
			}
			else if(team == specification.team3){
				flag = checkCategories(specification,team,type,impact);
			}
			else if(team == specification.team4){
				flag = checkCategories(specification,team,type,impact);
			}
		}
		return flag;
		
	}
    return function (items,filterCategory) {
        var filtered = [];
        angular.forEach(items, function(item) {
			var type,team,impact;
			type=item.playerTypeId;
			team=item.playerAplTeamId;
			impact = item.isImpact;
			if(!filterCategory.allrounder && !filterCategory.bat && !filterCategory.bowl && !filterCategory.team1 && !filterCategory.team2 && !filterCategory.team3 && !filterCategory.team4 && !filterCategory.impact){
				filtered.push(item);
			}
			else{
				var flag = playerSpecification(type,team,impact,filterCategory);
				if(flag){
					filtered.push(item);
				}
			}
        });
        return filtered;
    };

});
aplapp.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');
	$stateProvider
	.state('home',{
		url:'/home',
		controller: 'homeController',
		templateUrl: 'pages/home.html'
	})
    .state('resetPassword',{
		url:'/resetPassword/:email/:otp',
		controller: 'resetPasswordController',
		templateUrl: 'pages/resetPassword.html'
	})
    .state('forgotPassword',{
		url:'/forgotPassword',
		controller: 'forgotPasswordController',
		templateUrl: 'pages/forgotPassword.html'
	})
    .state('dashboard',{
		url:'/',
		controller: 'tourController',
		templateUrl: 'pages/tour.html'
	})
	.state('leaderBoard',{
		url:'/leaderBoard',
		controller: 'leaderController',
		templateUrl: 'pages/leaderBoard.html'
	})
	.state('players',{
		url:'/players',
		controller: 'playerController',
		templateUrl: 'pages/players.html',
	})
    .state('login',{
		url:'/login',
		controller: 'loginController',
		templateUrl: 'pages/login.html',
	})
    .state('register',{
		url:'/register',
		controller: 'registerController',
		templateUrl: 'pages/register.html',
	})
	.state('fixtures',{
		url:'/fixtures',
		controller: 'fixtureController',
		templateUrl: 'pages/fixtures.html'
	})
	.state('history',{
		url:'/history',
		controller: 'historyController',
		templateUrl: 'pages/history.html'
	})
	.state('historyLeader',{
		url:'/historyLeader/:teamId',
		controller: 'historyController',
		templateUrl: 'pages/history.html'
	})
	.state('playerHistory',{
		url:'/playerHistory/:matchId/:teamId/:key/:points',
		controller: 'playerHistoryController',
		templateUrl: 'pages/playerHistory.html'
	})
	.state('viewPlayerDetails',{
		url:'/viewPlayerDetails',
		controller: 'viewPlayerDetailsController',
		templateUrl: 'pages/viewPlayerDetails.html'
	})
	.state('howToPlay',{
		url:'/howToPlay',
		controller: 'howToPlay',
		templateUrl: 'pages/howToPlay.html'
	})
	.state('profile',{
		url:'/profile',
		controller: 'profileController',
		templateUrl: 'pages/profile.html'
	})
	.state('tour',{
		url:'/tour/:key',
		controller: 'tourController',
		templateUrl: 'pages/tour.html'
	});
});

aplapp.run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }
 
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/login' && !$rootScope.globals.currentUser && $location.path() != '/register' && !$location.path().startsWith('/resetPassword/') && $location.path() != '/forgotPassword') {
                $location.path('/login');
            }
        });
    }]);