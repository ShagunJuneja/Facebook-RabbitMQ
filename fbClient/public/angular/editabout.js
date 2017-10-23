/**
 * New node file
 */
var facebook = angular.module('facebook', []);

facebook.controller('aboutController', function($scope, $http) {
	//Initializing the 'invalid_login' and 'unexpected_error' 
	//to be hidden in the UI by setting them true,
	//Note: They become visible when we set them to false

	$http.get('/getAbout').success(function(data)
			{
		       $scope.name=data.about.name;
		       $scope.dob=data.about.dob;
		       $scope.hometown=data.about.hometown;
		       $scope.currentCity=data.about.currentcity;
		       $scope.school=data.about.school;
		       $scope.undergradCollege=data.about.undercollege;
		       $scope.gradCollege=data.about.gradcollege;
		       $scope.email=data.about.email;
		       $scope.phoneNumber=data.about.phone;
		       $scope.relationshipStatus=data.about.relationship;
			});
	
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
	
	$scope.submit = function() {
						
		$http({
			method : "POST",
			url : '/submitAbout',
			data : {
				"name" : $scope.name,
				"dob" : $scope.dob,
				"hometown" : $scope.hometown,
				"currentCity" : $scope.currentCity,
				"school" : $scope.school,
				"undergradCollege" : $scope.undergradCollege,
				"gradCollege" : $scope.gradCollege,
				"email" : $scope.email,
				"phoneNumber" : $scope.phoneNumber,
				"relationshipStatus" : $scope.relationshipStatus
			}
		}).success(function(data) {
			if(data.success == 1)
			{
				window.location.assign("/about"); 
			}
		}).error(function(error) {
//			$scope.unexpected_error = false;
//			$scope.invalid_login = true;
		});
	};
})