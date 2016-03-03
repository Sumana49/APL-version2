aplapp.factory("leaderBoard", function($http,$rootScope,$cookieStore) {
	return {
		 getLeaderBoard: function(quarter){
			 return $http.get(URLBASE + "getFantasyLeaderBoard?quarter="+quarter).then(function(response, status, headers, config) {
					res = response;
					return response.data.data.leaderboard;
			 });
	    }
    }
});



//Directives
//Menu item show
aplapp.directive('showonhoverparent',
   function() {
      return {
         link : function(scope, element, attrs) {
            element.parent().bind('mouseenter', function() {
                element.next().show();
            });
            element.parent().bind('mouseleave', function() {
                  element.next().hide();
            });
       }
   };
});
aplapp.directive('showthisonhover',
   function() {
      return {
         link : function(scope, element, attrs) {
            element.bind('mouseenter', function() {
                element.show();
				element.prev().addClass("opacityHover");
            });
			element.bind('mouseleave', function() {
                element.prev().removeClass("opacityHover");
            });
       }
   };
});
aplapp.directive('showonhover',
   function() {
      return {
         link : function(scope, element, attrs) {
            element.bind('mouseenter', function() {
                element.next().show();
            });
            element.bind('mouseleave', function() {
                  element.next().hide();
            });
       }
   };
});
aplapp.directive('onErrorSrc', function() {
    return {
        link: function(scope, element, attrs) {
          element.bind('error', function() {
            if (attrs.src != attrs.onErrorSrc) {
              attrs.$set('src', attrs.onErrorSrc);
            }
          });
        }
    }
});
/*File uploader*/
aplapp.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);

//Header resize
aplapp.directive("scroll", function ($window) {
    return function(scope, element, attrs) {
        angular.element($window).bind("scroll", function() {
             if (this.pageYOffset >= 60) {
                 scope.headerOnscroll = false;
             } else {
				 scope.headerOnscroll = true;
             }
            scope.$apply();
        });
    };
});

aplapp.factory('AuthenticationService',
    ['Base64', '$http', '$cookieStore', '$rootScope', '$timeout',
    function (Base64, $http, $cookieStore, $rootScope, $timeout) {
        var service = {};

        service.Login = function (username, password, callback) {

            $http.post(URLBASE+'loginUser', { email: username, password: password })
                .success(function (response) {
                    callback(response);
            });

        };
        service.Register = function (username, password,displayName, callback) {


            $http.post(URLBASE+'createFantasyUser ', {email: username, password: password,name:displayName })
                .success(function (response) {
                    callback(response);
            }).error(function(response){
                alert("Error on register");
            });

        };
 
        service.SetCredentials = function (username, password,displayName) {
            var authdata = Base64.encode(username + ':' + password);
 
            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata,
					displayName:displayName
                }
            };
 
            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            $cookieStore.put('globals', $rootScope.globals);
        };
 
        service.ClearCredentials = function () {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic ';
            
            // Clear team details
            $cookieStore.remove('teamDetails');
            
            // Clear auth token
            $cookieStore.remove('authToken');
        };
        
        // Set fantasy team details
        service.SetTeamDetails = function(userId,teamId,teamName){

            $rootScope.teamDetails = {
                teamId: teamId,
                teamName: teamName,
                userId:userId
            };
            $cookieStore.put('teamDetails', $rootScope.teamDetails);
        };
        
        // Set Authtoken
        service.SetAuthToken = function(token){
            $rootScope.authToken = {
                authToken: token
            };
            $cookieStore.put('authToken', $rootScope.authToken);
        };
		
		//LeaderBoard Team Details
		service.SetLeaderBoardTeamDetails = function(teamId,teamName){
            $rootScope.leaderBoardTeamDetails = {
                teamId: teamId,
				teamName: teamName
            };
            $cookieStore.put('leaderBoardTeamDetails', $rootScope.leaderBoardTeamDetails);
        };
		//Clear LeaderBoard Team Details
		service.clearLeaderBoardCredentials = function(){
			$rootScope.leaderBoardTeamDetails = {};
 			$cookieStore.remove('leaderBoardTeamDetails');
		};
		
		//Store match fixture details
		service.storeFixturesMatchDetails = function(matchDetail) {
			$rootScope.fixtureMatchDetails = matchDetail;
			$cookieStore.put('fixtureMatchDetails', $rootScope.fixtureMatchDetails);
		};
		
		//Clear match fixture credentials
		service.clearMatchFixtureCredentials = function(){
			$rootScope.fixtureMatchDetails = {};
			$cookieStore.remove('fixtureMatchDetails');
		}
        return service;
    }]);
 
aplapp.factory('Base64', function () {
    /* jshint ignore:start */
 
    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
 
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
 
            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
 
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
 
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
 
                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);
 
            return output;
        },
 
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
 
            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));
 
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
 
                output = output + String.fromCharCode(chr1);
 
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
 
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
 
            } while (i < input.length);
 
            return output;
        }
    };
});
aplapp.service('createTeamService',function() {
	var teamDetailsObj = {};
	return{
		putTeamDetails : function(teamDetails){
			teamDetailsObj = teamDetails;
		},
		getTeamDetails : function(){
			return teamDetailsObj;
		}
	};
});

aplapp.service('matchService',function() {
	var teamDetails = {};
	return{
		putMatchIdDetails : function(matchIdDetail,teamIdDetail,key){
			teamDetails = {
                matchId: matchIdDetail,
				teamId: teamIdDetail,
				key:key
            };
		},
		getMatchIdDetails : function(){
			return teamDetails;
		}
	};
});
aplapp.service('VideoControl',function() {
	return{
		play : function(){
			//$('#bgvid').get(0).play();
            return "play";
		},
        pause : function(){
			//$('#bgvid').get(0).pause();
            return "pause";
		},
        mute : function(){
           // $('#bgvid').get(0).muted = false;
			return "mute";
        },
	    unmute : function(){
            //$('#bgvid').get(0).muted = true;
			return "unmute";
        },
};
});
