/**
 * New node file
 */
var mq_client = require('../rpc/client');

var friendsList = exports.getFriendsList = function(req,res)
{
	console.log("inside getFriendsList");
	console.log(req.session.username);
	
	var msg_payload = { "userName": req.session.username };
	
	mq_client.make_request('showfriends_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			if (results.code == 200)
			{
				console.log(results.users);
				res.send({"code" : results.code,"users": results.users});
			}
			else
			{
				res.send({"code" : results.code});				
			}
		}  
	});
	

}

exports.acceptRequest = function(req,res)
{

}

exports.addFriend = function(req,res)
{
	
	
}