var tourCtrl = function ($scope,$http,$state, $rootScope, $cookieStore,$stateParams) {   
	$scope.exit = exit;
	function exit(){
		if($stateParams.key)
			$state.go('howToPlay');
		else
			$state.go('home');
	};
};