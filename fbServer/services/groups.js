var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/facebook";

exports.getGroups = function(msg, callback){
	
	var res = {};

	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var groupsCollection = mongo.collection('groups');

		groupsCollection.find({ 'useremail': msg.userName }).toArray(function(err, user){
		if (user) {
			
			for(var index = 0; index< user.length; index++)
			{
				if(user[index].createdby ==  msg.userName)
				{
					user[index].hasEditRights = true;
				}
				else
				{
					user[index].hasEditRights = false;
				}
			}
	
			res.code = "200";
			res.users = user;
			
		} else {
			//console.log("returned false");
			//json_responses = {"statusCode" : 401};
			//res.send(json_responses);
			res.code = "401";
		}
		callback(null, res);
	});
	});
};

var getGroupMembers = exports.getGroupMembers = function(msg, callback){
	
	var res = {};

	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var groupsCollection = mongo.collection('groups');
		
		console.log(msg.groupName+" "+msg.userName);

		groupsCollection.find({ 'groupname': msg.groupName }).toArray(function(err, user){
		if (user) {
			
			var searchResults = [];
			
			for(var index = 0; index< user.length; index++)
			{
				if (user[index].useremail == msg.userName)
				{
					continue;
				}
				
				var toInsertValue = user[index];
				
				if(user[index].createdby ==  msg.userName)
				{
					toInsertValue.hasEditRights = true;
				}
				else
				{
					toInsertValue.hasEditRights = false;
				}
				
				searchResults.push(toInsertValue);
			}
			
			console.log(searchResults);
			console.log(user);
	
			res.code = "200";
			res.users = searchResults;
			
		} else {
			//console.log("returned false");
			//json_responses = {"statusCode" : 401};
			//res.send(json_responses);
			res.code = "401";
		}
		callback(null, res);
	});
	});
};

exports.deleteMember = function(msg, callback){
	
	var res = {};

	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var groupsCollection = mongo.collection('groups');

		groupsCollection.removeOne({ 'useremail': msg.userEmail , 'groupname' : msg.groupName},function(err, user){
			if (user) {
				
				res.code = "200";
				res.success = 1;
				
			} else {
				//console.log("returned false");
				//json_responses = {"statusCode" : 401};
				//res.send(json_responses);
				res.code = "401";
			}
			callback(null, res);
		});
	});
};

exports.deleteGroup = function(msg, callback){
	
	var res = {};

	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var groupsCollection = mongo.collection('groups');

		groupsCollection.remove({ 'groupname': msg.groupName , 'createdby' : msg.userName},function(err, user){
			if (user) {
				
				res.code = "200";
				res.success = 1;
				
			} else {
				//console.log("returned false");
				//json_responses = {"statusCode" : 401};
				//res.send(json_responses);
				res.code = "401";
			}
			callback(null, res);
		});
	});
};

exports.groupsGetFriends = function(msg, callback){
	
	var res = {};

	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var friendsCollection = mongo.collection('friends');

		friendsCollection.find({ 'friend1' : msg.userName, 'status': 'ACC'},{friend2: 1, friend2name: 1, status: 1, _id: 0}).toArray(function(err, user){
			if (user) {
				
				var searchResults = [];
				
				for(var index = 0; index < user.length; index++)
				{
					searchResults.push({friendEmail : user[index].friend2,
		                                friendName : user[index].friend2name,
		                                checked : false});
				}
				
				console.log(searchResults);
				
				res.code = "200";
				res.success = 1;
				res.searchResults = searchResults;
				
			} else {
				//console.log("returned false");
				//json_responses = {"statusCode" : 401};
				//res.send(json_responses);
				res.code = "401";
			}
			callback(null, res);
		});
	});
};

exports.createGroup = function(msg, callback){
	
	var res = {};

	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var groupsCollection = mongo.collection('groups');

		console.log(msg);
		
		var toInsert = [];
		
		for (var index = 0; index< msg.groupMembers.length; index++)
		{
			toInsert.push({"groupname": msg.groupName, "createdby": msg.userName, "useremail": msg.groupMembers[index].userEmail, "username": msg.groupMembers[index].userName});
		}
		
		toInsert.push({"groupname": msg.groupName, "createdby": msg.userName, "useremail": msg.userName, "username": msg.userWholeName});
		
		console.log(toInsert);
		
		groupsCollection.insertMany(toInsert,function(err,user){
			
			if(user)
			{
				res.code = "200";
			}
			else
			{
				res.code = "401";
			}
			callback(null, res);
			
		});
		
//		groupsCollection.removeOne({ 'useremail': msg.userEmail , 'groupname' : msg.groupName},function(err, user){
//			if (user) {
//				
//				res.code = "200";
//				res.success = 1;
//				
//			} else {
//				//console.log("returned false");
//				//json_responses = {"statusCode" : 401};
//				//res.send(json_responses);
//				res.code = "401";
//			}
//			callback(null, res);
//		});
	});
};