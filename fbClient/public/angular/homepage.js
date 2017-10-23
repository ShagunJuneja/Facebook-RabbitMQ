/**
 * New node file
 */
var facebook = angular.module('facebook', []);
facebook.controller('homepage', function($scope, $http) {
	$scope.invalid_login = true;
	$scope.unexpected_error = true;
	$scope.searchuser = function() {
				
		$http({
			method : "POST",
			url : '/redirectToSearch',
			data : {
				"search" : $scope.search
			}
		}).success(function(data) {
			
			if(data.success == 1)
			{
				window.location.assign("/showSearch"); 
			} 
		}).error(function(error) {
		});
	};
	
	$http.get('/getStatuses').success(function(data)
	{
		
		$scope.statuses = data.results;
		$scope.$apply();
	});
	
	$scope.postStatus = function(req,res)
	{
		$http({
			method : "POST",
			url : '/postStatus',
			data : {
				"status" : $scope.currentStatus
			}
		}).success(function(data) {
			
			$scope.statuses = data.results;
			$scope.currentStatus = null;
			$scope.$apply();
			
		}).error(function(error) {
			
			alert("error");
			
		});
	};
})