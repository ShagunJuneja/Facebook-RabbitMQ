/**
 * New node file
 */
var facebook = angular.module('facebook', []);
// defining the login controller
facebook.controller('searchController', function($scope, $http)
{
	$scope.searchuser = function()
	{
		$http({
			method : "POST",
			url : '/redirectToSearch',
			data : {
				"search" : $scope.search
			}
		}).success(function(data)
		{

			if (data.success == 1)
			{
				window.location.assign("/showSearch");
			}
		}).error(function(error)
		{
		});
	};

	$http({
		method : "GET",
		url : '/getSearchedUsers',
		data : {
			"search" : $scope.search
		}
	}).success(function(data)
	{

		// alert(data.results[0].wholename);
		$scope.searchedUsers = data.users;
		// alert($scope.searchedUsers.length);
		$scope.$apply();

	}).error(function(error)
	{
	});

	$scope.buttonclass = function(user)
	{
		switch (user.status)
		{
			case null:
				return 'uibutton confirm facebookButtonWrap';
				break;
			case 'RCV':
				return 'uibutton confirm facebookButtonWrap';
				break;
			case 'REQ':
				return 'uibutton confirm facebookButtonWrap';
				break;
			default:
				return 'uibutton special facebookButtonSpecialWrap';
				break;
		}
	};

	$scope.buttonClick = function(user)
	{			
		if (user.status == 'REQ')
		{			
			$http({
				method : "POST",
				url : '/searchAcceptRequest',
				data : {
					"friendEmail" : user.friend1
				}
			}).success(function(data)
			{
				$scope.searchedUsers = data.users;
				// alert($scope.searchedUsers.length);
				$scope.$apply();

			}).error(function(error)
			{
			});

		} else if (user.status == null)
		{
			$http({
				method : "POST",
				url : '/searchAddFriend',
				data : {
					"friendEmail" : user.friend1,
					"friendName" : user.friend1name
				}
			}).success(function(data)
			{
				$scope.searchedUsers = data.users;
				// alert($scope.searchedUsers.length);
				$scope.$apply();

			}).error(function(error)
			{
			});
		}
	}
})
