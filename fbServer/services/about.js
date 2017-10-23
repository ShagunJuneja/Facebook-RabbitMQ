var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/facebook";

exports.submitAbout = function(msg, callback){
	
	var res = {};
	console.log(msg);
	
//	var json_responses;

	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('about');
		
//		coll.insertOne({uid: msg.username, name: msg.name, dob: msg.dob, hometown: msg.hometown, currentCity: msg.currentCity, school: msg.school, undergradCollege: msg.undergradCollege, gradCollege: msg.gradCollege, email: msg.email, phoneNumber: msg.phoneNumber, relationshipStatus: msg.relationshipStatus}, function(err, result){
//			if(result){
//			//	json_responses = {"statusCode" : 200 };
//			//	res.send(json_responses);
//				res.code = "200";
//			}
//			else{
////				console.log("returned false");
////				json_responses = {"statusCode" : 401};
////				res.send(json_responses);
//				res.code = "401";				
//			}
//			callback(null, res);
//		});
		
		coll.update(
				   { uid: msg.username },
				   {
					  uid: msg.username, name: msg.name, dob: msg.dob, hometown: msg.hometown, currentCity: msg.currentCity, school: msg.school, undergradCollege: msg.undergradCollege, gradCollege: msg.gradCollege, email: msg.email, phoneNumber: msg.phoneNumber, relationshipStatus: msg.relationshipStatus,
				      rating: 1,
				      score: 1
				   },
				   { upsert: true }
				   , function(err, result){
						if(result){
						//	json_responses = {"statusCode" : 200 };
						//	res.send(json_responses);
							res.code = "200";
						}
						else{
//							console.log("returned false");
//							json_responses = {"statusCode" : 401};
//							res.send(json_responses);
							res.code = "401";				
						}
						callback(null, res);
					});
		
	});
};  

exports.getAbout = function(msg, callback){
	
	var res = {};
	
//	var json_responses;

	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('about');
		console.log(msg.uid);
		
		coll.findOne({uid: msg.uid}, function(err, user){
			if (user) {
		
				console.log(user);
				res.code = "200";
				res.about = {"name" : user.name,
			              "hometown" : user.hometown,
			              "currentcity" : user.currentCity,
			              "dob" : user.dob,
			              "school" : user.school,
			              "undercollege" : user.undergradCollege,
			              "gradcollege" : user.gradCollege,
			              "email" : user.email,
			              "phone" : user.phoneNumber,
			              "relationship" : user.relationshipStatus}

			} else {
				//console.log("returned false");
				//json_responses = {"statusCode" : 401};
				//res.send(json_responses);
				res.code = "401";
				res.value = "Failed Login";
				res.success = -1;
			}
			callback(null, res);
		});
	});
};  