/**
 * New node file
 */
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/facebook";

exports.getFriendsList = function(msg, callback){
	
	var res = {};
	console.log(msg);
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var usersCollection = mongo.collection('users');
		
		usersCollection.find({ 'email': { $ne: msg.userName} },
		              {email:1,firstname:1,lastname:1,_id:0}).toArray(function(err, user){
			if (user) {
		
				var userArray = [];
				var emailArray = [];
				
				for(var index = 0; index<user.length; index++)
				{
					emailArray.push(user[index].email);
					userArray.push({"wholeName": user[index].firstname + " " +user[index].lastname,"email":user[index].email});	
				}
				
				console.log(userArray);
				console.log(emailArray);
				
				var friendsCollection = mongo.collection('friends');
				
				friendsCollection.find({$and:[{"friend1": {$in: emailArray}},{"friend2": msg.userName},{"status": {$in: ['REQ','ACC']}}]},{friend1:1, friend1name:1, status:1, _id: 0}).toArray(function(err, user){
					
					if(user)
					{
						console.log(user);
												
						res.code = "200";
						res.users = user;
					}
					else
					{
						res.code = "401";
					}
					callback(null, res);
				});
			} else {
				//console.log("returned false");
				//json_responses = {"statusCode" : 401};
				//res.send(json_responses);
				res.code = "401";
				callback(null, res);
			}
		});
	});
};

exports.friendsAcceptRequest = function(msg, callback){
	
	var res = {};
	console.log(msg);
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var friendsCollection = mongo.collection('friends');
		
		console.log("msg.userName "+msg.userName+" msg.friendEmail "+msg.friendEmail+" msg.searchString "+msg.searchString);
		
		friendsCollection.updateMany({ $and: [{"friend1": {$in: [msg.userName, msg.friendEmail]}},{"friend2": {$in: [msg.userName, msg.friendEmail]}}] },
				   {
				      '$set': {status: "ACC"}
				   },
				   { multi: true },
				   function(err,user){
					   
					   if(user)
					   {
						   searchUser(msg, callback);
					   }
					   else
					   {
						   res.code = "401";
						   callback(null,res);
					   }
				   });
	});
};

exports.friendsAddFriend = function(msg, callback){
	
	var res = {};
	console.log(msg);
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var friendsCollection = mongo.collection('friends');
		
		console.log("msg.userName "+msg.userName+" msg.friendEmail "+msg.friendEmail+" msg.searchString "+msg.searchString+" msg.userWholeName "+msg.userWholeName+" msg.friendName "+msg.friendName);
		
		friendsCollection.insertMany([{"friend1":msg.userName, "friend2":msg.friendEmail, "friend1name":msg.userWholeName, "friend2name":msg.friendName, "status":"REQ"},
		                              {"friend1":msg.friendEmail, "friend2":msg.userName, "friend1name":msg.friendName, "friend2name":msg.userWholeName, "status":"RCV"}], function(err,user){
			if(user)
			   {
				   searchUser(msg, callback);
			   }
			   else
			   {
				   res.code = "401";
				   callback(null,res);
			   }
		});
	});
};