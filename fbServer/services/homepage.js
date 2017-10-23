var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/facebook";

var getStatuses = exports.getStatus = function(msg, callback){
	
	var res = {};
	console.log("In login handle request:"+ msg.username);
	
//	var json_responses;

	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var friendsCollection = mongo.collection('friends');

		friendsCollection.find({friend1: msg.userName, status:'ACC'}, { friend2: 1, status: 1 }).toArray(function(err, user){
			if (user) {
				
				console.log(user);
				
				var emailArray = [];
				
				for(var index = 0; index< user.length; index++)
				{
					emailArray.push(user[index].friend2);
				}
				
				emailArray.push(msg.userName);
				
				var statusCollection = mongo.collection('status');
				
				statusCollection.find({ $query: {"username": {$in: emailArray}}, $orderby: { postdate : -1 } }).toArray(function(err,user){
					if(user)
					{
						
						
						for(var index = 0; index<user.length; index++)
						{
							var postdate = new Date(user[index].postdate.getTime());
							
							[index].postdate = postdate.getDate()+"/"+postdate.getMonth()+"/"+postdate.getYear()+" "+postdate.getHours()+":"+postdate.getMinutes();
						   
						}
						
						console.log(user);
						
						res.code = "200";
						res.statuses = user;
					}
					else
					{
						res.code = "401";
						res.success = -1;
						console.log(err);
					}
					callback(null, res);
				});

			} else {
				//console.log("returned false");
				//json_responses = {"statusCode" : 401};
				//res.send(json_responses);
				res.code = "401";
				res.value = "Failed Login";
				res.success = -1;
				callback(null, res);
			}
		});
		
	});
};  

exports.postStatus = function(msg, callback){
	
	var res = {};
	console.log("In login handle request:"+ msg.username);
	
//	var json_responses;

	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var statusCollection = mongo.collection('status');

		statusCollection.insert({username: msg.userName, status: msg.status, postdate: new Date()},function(err, user){
			if (user) {
			
				getStatuses(msg,callback);

			} else {
				//console.log("returned false");
				//json_responses = {"statusCode" : 401};
				//res.send(json_responses);
				res.code = "401";
				res.value = "Failed Login";
				res.success = -1;
				callback(null, res);
			}
			
		});
		
	});
}; 