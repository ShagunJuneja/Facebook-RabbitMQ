var facebook = angular.module('facebook', []);

facebook.controller('signupFunction', function($scope, $http) {
	
	$scope.invalid_login = true;
	$scope.unexpected_error = true;
	$scope.signup = function() {
		$http({
			method : "POST",
			url : '/signup',
			data : {
				"fname" : $scope.fname,
				"lname" : $scope.lname,
				"email" : $scope.email,
				"password" : $scope.password
			}
		}).success(function(data) {
			//alert('success');
			
			if(data.code == 200)
			{
				alert("Signup successful! Login to proceed."); 
				window.location.assign("/");
			}
			 
		}).error(function(error) {
			alert('error');
		});
	};
})

facebook.controller('signinFunction', function($scope, $http) {
	
	$scope.invalid_login = true;
	$scope.unexpected_error = true;
	$scope.signin = function() {

		if($scope.session_key == 'undefined')
		{
			return;
		}
				
		$http({
			method : "POST",
			url : '/signin',
			data : {
				"email" : $scope.session_key,
				"password" : $scope.session_password
			}
		}).success(function(data) {
						
			if(data.success == 1)
			{
				window.location.assign("/homepage"); 
			} 
		}).error(function(error) {
		});
	};
})