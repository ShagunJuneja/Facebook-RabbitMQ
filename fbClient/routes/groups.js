/**
 * New node file
 */
var mq_client = require('../rpc/client');

exports.getFriends = function(req,res){
	
var msg_payload = { "userName": req.session.username };
	
	mq_client.make_request('groups_get_friend_queue',msg_payload, function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{
			if (results.code == 200)
			{
				console.log(results.users);
				res.send({"code" : results.code,"results": results.searchResults});
			}
			else
			{
				res.send({"code" : results.code});				
			}
		}  
	});
}

exports.getGroups = function(req,res){
		
	var msg_payload = { "userName": req.session.username };
	
	mq_client.make_request('groups_queue',msg_payload, function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{
			if (results.code == 200)
			{
				console.log(results.users);
				res.send({"code" : results.code,"results": results.users});
			}
			else
			{
				res.send({"code" : results.code});				
			}
		}  
	});
}

exports.getGroupMembers = function(req,res){
	
    var msg_payload = { "userName": req.session.username,"groupName": req.param('groupName') };
	
	mq_client.make_request('groupmembers_queue',msg_payload, function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{
			if (results.code == 200)
			{
				console.log(results.users);
				res.send({"code" : results.code,"results": results.users});
			}
			else
			{
				res.send({"code" : results.code});				
			}
		}  
	});
}

exports.deleteMember = function(req,res){
		
    var msg_payload = { "userEmail": req.param('userEmail'),"groupName": req.param('groupName'),"userName":req.session.username };
    	
	mq_client.make_request('delete_member_queue',msg_payload, function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{
			if (results.code == 200)
			{
				console.log(results.success);
				res.send({"code" : results.code,"success": results.success});
			}
			else
			{
				res.send({"code" : results.code});				
			}
		}  
	});
}

exports.deleteGroup = function(req,res){
		
	var msg_payload = { "groupName": req.param('groupName'),"userName":req.session.username };
	
	mq_client.make_request('delgrp_queue',msg_payload, function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{
			if (results.code == 200)
			{
				console.log(results.success);
				res.send({"code" : results.code,"success": results.success});
			}
			else
			{
				res.send({"code" : results.code});				
			}
		}  
	});
}

exports.createGroup = function(req,res){
	
    var msg_payload = { "groupName": req.param('groupName'),"userName":req.session.username,"groupMembers": req.param('groupMembers'),"userWholeName":req.session.wholename };
	
	mq_client.make_request('creategrp_queue',msg_payload, function(err,results){
		
		if(err){
			throw err;
		}
		else 
		{
			if (results.code == 200)
			{
				console.log(results.success);
				res.send({"code" : results.code,"success": results.success});
			}
			else
			{
				res.send({"code" : results.code});				
			}
		}  
	});
	

}