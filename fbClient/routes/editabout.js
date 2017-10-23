/**
 * New node file
 */
var mq_client = require('../rpc/client');

var name="";
var dob="";
var hometown="";
var currentCity="";

var school="";
var undergradCollege="";
var gradCollege="";

var phone="";
var email="";

var status="";

exports.redirectToAbout = function(req,res)
{
	//Checks before redirecting whether the session is valid
	if(req.session.username)
	{
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("about",{username:req.session.username});
	}
	else
	{
		res.redirect('/');
	}
};

exports.getAbout = function(req,res)
{	
	console.log("inside getAbout");
	console.log(req.session.username);
	
	var msg_payload = { "uid": req.session.username };
	
	mq_client.make_request('about_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			if (results.code == 200)
			{
				res.send({"code" : results.code,"about" : results.about});
			}
			else
			{
				res.send({"code" : results.code});				
			}
		}  
	});
};

exports.submitAbout = function(req,res)
{
	//Checks before redirecting whether the session is valid
	if(req.session.username)
	{
		console.log("inside submitAbout");
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

		name = req.param("name");
		dob = req.param("dob");
		hometown = req.param("hometown");
		currentCity = req.param("currentCity");
		
		school = req.param("school");
		undergradCollege = req.param("undergradCollege");
		gradCollege = req.param("gradCollege");
		
		email = req.param("email");
		phone = req.param("phoneNumber");
		
		status = req.param("relationshipStatus");
		
		var msg_payload = { "username": req.session.username,"name": name,"dob": dob,"hometown": hometown,"currentCity": currentCity, "school":school,"undergradCollege": undergradCollege, "gradCollege": gradCollege, "email": email, "phoneNumber": phone, "relationshipStatus": status };
		
		mq_client.make_request('editabout_queue',msg_payload, function(err,results){
			
			console.log(results);
			if(err){
				throw err;
			}
			else 
			{
				if (results.code == 200)
				{
					res.send({"code" : results.code,"success" : 1});
				}
				else
				{
					res.send({"code" : results.code});				
				}
				
			}  
		});
	}
	else
	{
		res.redirect('/');
	}
}

