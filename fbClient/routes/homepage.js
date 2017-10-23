/**
 * New node file
 */
var mq_client = require('../rpc/client');

exports.redirectToSearch = function(req, res)
{
	console.log("search user");
	req.session.search = req.param("search");
	var json_responses = {
		"success" : 1
	};
	res.send(json_responses);
}

exports.Homepage = function(req, res)
{
	// Checks before redirecting whether the session is valid
	if (req.session.username)
	{
		// Set these headers to notify the browser not to maintain any cache for
		// the page being loaded
		res
				.header(
						'Cache-Control',
						'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("homepage", {
			username : req.session.username
		});
	} else
	{
		res.redirect('/');
	}
};

exports.redirectToEditAbout = function(req, res)
{
	// Checks before redirecting whether the session is valid
	if (req.session.username)
	{
		// Set these headers to notify the browser not to maintain any cache for
		// the page being loaded
		res
				.header(
						'Cache-Control',
						'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("editabout", {
			username : req.session.username
		});
	} else
	{
		res.redirect('/');
	}
};

exports.redirectToGroups = function(req, res)
{
	// Checks before redirecting whether the session is valid
	if (req.session.username)
	{
		// Set these headers to notify the browser not to maintain any cache for
		// the page being loaded
		res
				.header(
						'Cache-Control',
						'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("groups", {
			username : req.session.username
		});
	} else
	{
		res.redirect('/');
	}
};

exports.redirectToFriends = function(req, res)
{
	// Checks before redirecting whether the session is valid
	if (req.session.username)
	{
		// Set these headers to notify the browser not to maintain any cache for
		// the page being loaded
		res
				.header(
						'Cache-Control',
						'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("friends", {
			username : req.session.username
		});
	} else
	{
		res.redirect('/');
	}
};

var getStatuses = exports.getStatuses = function(req, res)
{
    var msg_payload = { "userName": req.session.username };
    
    console.log(msg_payload);
	
	mq_client.make_request('showstatus_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			res.send({"results" : results.statuses});
		}  
	});
}

exports.postStatus = function(req,res)
{
    var msg_payload = { "userName": req.session.username,"status": req.param("status") };
	
	mq_client.make_request('post_status_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			console.log('post status successful');
			res.send({"results" : results.statuses});
		}  
	});
}