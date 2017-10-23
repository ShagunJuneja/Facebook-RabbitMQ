var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/facebook";

var searchUsers = exports.searchUsers = function(msg, callback){
	
	var res = {};
	console.log("msg "+msg);
	
//	var json_responses;

	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var usersCollection = mongo.collection('users');
		
		usersCollection.find({$and:[{ 'email': { $ne: msg.email} },
		                    {'$or':[{'firstname':{'$regex':msg.searchString, '$options':'i'}},
		                            {'lastname':{'$regex':msg.searchString, '$options':'i'}}]}
		                   ]},
		              {email:1,firstname:1,lastname:1,_id:0}).toArray(function(err, user){
			if (user) {
				console.log('user');
		console.log(user);
				var userArray = [];
				var emailArray = [];
				
				for(var index = 0; index<user.length; index++)
				{
					emailArray.push(user[index].email);
					userArray.push({"fullname": user[index].firstname + " " +user[index].lastname,"email":user[index].email});	
				}
				
				console.log(userArray);
				console.log(emailArray);
				
				var friendsCollection = mongo.collection('friends');
				
				friendsCollection.find({$and:[{"friend1": {$in: emailArray}},{"friend2": msg.email}]},{friend1:1, friend1name:1, status:1, _id: 0}).toArray(function(err, user){
					
					if(user)
					{
						console.log(user);
						
						var notFoundArray = [];
						var friendsEmailArray = [];
						
						for (var index = 0; index< user.length; index++)
						{
							friendsEmailArray.push(user[index].friend1);
						}
						
						for (var index = 0; index < userArray.length; index++)
						{
							if(friendsEmailArray.indexOf(userArray[index].email) == -1)
							{
								user.push({"friend1" : userArray[index].email, "friend1name": userArray[index].fullname, status: null});
							}
						}
						
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

exports.searchAcceptRequest = function(msg, callback){
	
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

exports.searchAddFriend = function(msg, callback){
	
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
				   searchUsers(msg, callback);
			   }
			   else
			   {
				   res.code = "401";
				   callback(null,res);
			   }
		});
		

	});
};