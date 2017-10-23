
var mq_client = require('../rpc/client');

exports.showSearch = function(req, res){
	if(req.session.username)
	{
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("searchUser",{search:req.session.search});
	}
	else
	{
		res.redirect('/');
	}
}

exports.searchAcceptRequest = function(req,res)
{
	console.log("inside searchAcceptRequest");
	console.log(req.session.username);
	
	var msg_payload = { "userName": req.session.username,"friendEmail": req.param('friendEmail'),"searchString":req.session.search };
	
	mq_client.make_request('searchNaccept_queue',msg_payload, function(err,results){
		
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

exports.searchAddFriend = function(req,res)
{
	console.log("inside searchAddFriend");
	console.log(req.session.username);
	
	var msg_payload = { "userName": req.session.username,"friendEmail": req.param('friendEmail'),"searchString":req.session.search,"userWholeName":req.session.wholename,"friendName":req.param('friendName') };
	
	mq_client.make_request('searchNadd_queue',msg_payload, function(err,results){
		
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

exports.getSearchedUsers = function(req, res){
	
	console.log("inside searchUser");
	console.log(req.session.username);
	
	var msg_payload = { "email": req.session.username,"searchString": req.session.search };
	
	mq_client.make_request('search_people_queue',msg_payload, function(err,results){
		
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
	

};