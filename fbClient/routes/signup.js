/**
 * New node file
 */
var mq_client = require('../rpc/client');

exports.signup = function(req, res){
	
//	var connection=getConnection();
//	
	var fname = req.param("fname");
	var lname = req.param("lname");
	var email = req.param("email");
	var password = req.param("password");
	var msg_payload = { "fname": fname, "lname": lname, "email": email, "password": password };
	console.log(msg_payload);
mq_client.make_request('signup_queue', msg_payload, function(err,results){
		
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log("valid Login");
				req.session.username=email;
				res.send({"success":1,"code":200});
			}
			else {    
				
				console.log("Invalid Login");
				res.send({"success":0});
			}
		}  
	});


};

exports.signin = function(req, res){
	
	var email = req.param("email");
	var password = req.param("password");
	
	console.log("inside signin");
	
	var msg_payload = { "email": email, "password": password };
	
	mq_client.make_request('login_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			if (results.success == 1)
			{
				req.session.username = email;
				req.session.wholename = results.wholename;
			}
			res.send({"success" : results.success});
		}  
	});
	
}; 

exports.signout = function(req, res){
	req.session.destroy();
	res.redirect('/');

};
