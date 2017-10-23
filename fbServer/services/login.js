var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/facebook";
var bcrypt = require('bcrypt-nodejs');

exports.handle_request = function(msg, callback){
	
	var res = {};
	console.log("In login handle request:"+ msg.email);
	
//	var json_responses;

	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('users');
		console.log(msg.email);

		var itr = coll.findOne({email: msg.email}, { email: 1, password: 1, firstname: 1, lastname: 1 }, function(err, user){
			if (user) {
				// This way subsequent requests will know the user is logged in.
				//req.session.username = user.username;
				//console.log(req.session.username +" is the session");
				//json_responses = {"statusCode" : 200};
				//res.send(json_responses);
//				res.code = "200";
//				res.value = "Succes Login";
//				res.fname = user.fname;
//				res.lname = user.lname;
				
				console.log(user.email);
				
				if (bcrypt.compareSync(msg.password, user.password))
				{
					res.code = "200";
					res.success = 1
					res.wholename = user.firstname+" "+user.lastname;
				}
				else
				{
					res.code = "401";
					res.success = 0;
				}

			} else {
				//console.log("returned false");
				//json_responses = {"statusCode" : 401};
				//res.send(json_responses);
				res.code = "401";
				res.value = "Failed Login";
				res.success = -1;
			}
			console.log(res);
			callback(null, res);
		});
	});
};  