var mongo = require('./mongo');

var mongoURL = "mongodb://localhost:27017/facebook";
var bcrypt = require('bcrypt-nodejs');

exports.handle_request = function(msg, callback){
	
	var res = {};
	console.log("In register handle request:"+ msg.email);
	
	mongo.connect(mongoURL, function() {
		var coll = mongo.collection('users');
		
		var hash = bcrypt.hashSync(msg.password);
		
		coll.insertOne({firstname: msg.fname,  lastname: msg.lname, email: msg.email, password: hash}, function(err, result){
			if(result){
			//	json_responses = {"statusCode" : 200 };
			//	res.send(json_responses);
				
				res.code = "200";
				res.value = "Succes Registration";
			}
			else{
//				console.log("returned false");
//				json_responses = {"statusCode" : 401};
//				res.send(json_responses);
				res.code = "401";
				res.value = "Error in Registration";
				
			}
			console.log(res);
			callback(null, res);
		});
	});
};