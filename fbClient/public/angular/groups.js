/**
 * New node file
 */
var facebook = angular.module('facebook', []);

facebook.controller('groupsController', function($scope, $http)
{
	$http.get('/getGroups').success(function(data)
	{		
		$scope.groups = data.results;
		$scope.$apply();
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

	$scope.getGroupMembers = function(groupName,groupId)
	{
		$scope.clickedGroupId = groupId;

		$http({
			method : "POST",
			url : '/getGroupMembers',
			data : {
				"groupName" : groupName
			}
		}).success(function(data)
		{			
			$scope.clickedGroup = groupName;
			$scope.groupMembers = data.results;

			if ($scope.groupMembers.length > 0)
			{
				$scope.hasEditRights = $scope.groupMembers[0].hasEditRights;
			}
			
			$scope.$apply();

		}).error(function(error)
		{
		});
	};

	$scope.deleteMember = function(groupName, userEmail)
	{				
		$http({
			method : "POST",
			url : '/deleteMember',
			data : {
				"groupName" : groupName,
				"userEmail" : userEmail
			}
		}).success(function(data)
		{
			if (data.success == 1)
			{
				// alert("member deleted");

				$scope.groupMembers = $scope.groupMembers.filter(function(obj)
				{
					return obj.useremail !== userEmail;
				});
				$scope.$apply();
			}

		}).error(function(error)
		{
		});
	};

	$scope.deleteGroup = function(groupName,createdBy)
	{

		$http({
			method : "POST",
			url : '/deleteGroup',
			data : {
				"groupName" : groupName,
				"createdBy" : createdBy
			}
		}).success(function(data)
		{
			if (data.success == 1)
			{
				$scope.groups = $scope.groups.filter(function(obj)
				{
					return obj.groupname !== groupName;
				});
				$scope.$apply();
			}
		}).error(function(error)
		{
		});
	};
	
	$scope.getFriends = function()
	{
		$http.get('/getFriends').success(function(data)
				{
					$scope.friends = data.results;
					$scope.$apply();
				});
	}
	
	$scope.createGroup = function()
	{
		var counter = 0;
		var groupMembers = [];
		
		for (var index = 0; index < $scope.friends.length; index++)
		{
			if ($scope.friends[index].checked)
			{
				groupMembers.push({userEmail:$scope.friends[index].friendEmail,userName:$scope.friends[index].friendName});
			}
		}
				
		$http({
			method : "POST",
			url : '/createGroup',
			data : {
				"groupMembers" : groupMembers,
				"groupName" : $scope.toBeCreatedGroupName
			}
		}).success(function(data)
		{
//			if (data.success == 1)
//			{
//				$scope.groups = $scope.groups.filter(function(obj)
//				{
//					return obj.groupName !== groupName;
//				});
//				$scope.$apply();
//			}
		}).error(function(error)
		{
		});
	}
})