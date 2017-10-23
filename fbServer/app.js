
//super simple rpc server example
var amqp = require('amqp')
, util = require('util');

var signup = require('./services/signup')
var login = require('./services/login');
var searchppl = require('./services/searchppl');
var friends = require('./services/friends');
var groups = require('./services/groups');
var homepage = require('./services/homepage');
var about = require('./services/about');

var cnn = amqp.createConnection({host:'127.0.0.1'});

cnn.on('ready', function(){

	cnn.queue('login_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			login.handle_request(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	
	cnn.queue('signup_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			signup.handle_request(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


cnn.queue('search_people_queue', function(q){
	q.subscribe(function(message, headers, deliveryInfo, m){
		util.log(util.format( deliveryInfo.routingKey, message));
		util.log("Message: "+JSON.stringify(message));
		util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
		
		searchppl.searchUsers(message, function(err, res){
			
			cnn.publish(m.replyTo, res, {
				contentType:'application/json',
				contentEncoding:'utf-8',
				correlationId:m.correlationId
			});
		});
	});
});

cnn.queue('searchNaccept_queue', function(q){
	q.subscribe(function(message, headers, deliveryInfo, m){
		util.log(util.format( deliveryInfo.routingKey, message));
		util.log("Message: "+JSON.stringify(message));
		util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
		
		searchppl.searchAcceptRequest(message, function(err, res){
			
			cnn.publish(m.replyTo, res, {
				contentType:'application/json',
				contentEncoding:'utf-8',
				correlationId:m.correlationId
			});
		});
	});
});

cnn.queue('searchNadd_queue', function(q){
	q.subscribe(function(message, headers, deliveryInfo, m){
		util.log(util.format( deliveryInfo.routingKey, message));
		util.log("Message: "+JSON.stringify(message));
		util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
		
		searchppl.searchAddFriend(message, function(err, res){
			
			cnn.publish(m.replyTo, res, {
				contentType:'application/json',
				contentEncoding:'utf-8',
				correlationId:m.correlationId
			});
		});
	});
});

cnn.queue('showfriends_queue', function(q){
	q.subscribe(function(message, headers, deliveryInfo, m){
		util.log(util.format( deliveryInfo.routingKey, message));
		util.log("Message: "+JSON.stringify(message));
		util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
		
		friends.getFriendsList(message, function(err, res){
			
			cnn.publish(m.replyTo, res, {
				contentType:'application/json',
				contentEncoding:'utf-8',
				correlationId:m.correlationId
			});
		});
	});
});

cnn.queue('acceptfriends_queue', function(q){
	q.subscribe(function(message, headers, deliveryInfo, m){
		util.log(util.format( deliveryInfo.routingKey, message));
		util.log("Message: "+JSON.stringify(message));
		util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
		
		friends.friendsAcceptRequest(message, function(err, res){
			
			cnn.publish(m.replyTo, res, {
				contentType:'application/json',
				contentEncoding:'utf-8',
				correlationId:m.correlationId
			});
		});
	});
});

cnn.queue('addfriend_queue', function(q){
	q.subscribe(function(message, headers, deliveryInfo, m){
		util.log(util.format( deliveryInfo.routingKey, message));
		util.log("Message: "+JSON.stringify(message));
		util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
		
		friends.friendsAddFriend(message, function(err, res){
			
			cnn.publish(m.replyTo, res, {
				contentType:'application/json',
				contentEncoding:'utf-8',
				correlationId:m.correlationId
			});
		});
	});
});

cnn.queue('groups_queue', function(q){
	q.subscribe(function(message, headers, deliveryInfo, m){
		util.log(util.format( deliveryInfo.routingKey, message));
		util.log("Message: "+JSON.stringify(message));
		util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
		
		groups.getGroups(message, function(err, res){
			
			cnn.publish(m.replyTo, res, {
				contentType:'application/json',
				contentEncoding:'utf-8',
				correlationId:m.correlationId
			});
		});
	});
});

cnn.queue('groupmembers_queue', function(q){
	q.subscribe(function(message, headers, deliveryInfo, m){
		util.log(util.format( deliveryInfo.routingKey, message));
		util.log("Message: "+JSON.stringify(message));
		util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
		
		groups.getGroupMembers(message, function(err, res){
			
			cnn.publish(m.replyTo, res, {
				contentType:'application/json',
				contentEncoding:'utf-8',
				correlationId:m.correlationId
			});
		});
	});
});

cnn.queue('delgroup_queue', function(q){
	q.subscribe(function(message, headers, deliveryInfo, m){
		util.log(util.format( deliveryInfo.routingKey, message));
		util.log("Message: "+JSON.stringify(message));
		util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
		
		groups.deleteGroup(message, function(err, res){
			
			cnn.publish(m.replyTo, res, {
				contentType:'application/json',
				contentEncoding:'utf-8',
				correlationId:m.correlationId
			});
		});
	});
});

cnn.queue('grpfriend_queue', function(q){
	q.subscribe(function(message, headers, deliveryInfo, m){
		util.log(util.format( deliveryInfo.routingKey, message));
		util.log("Message: "+JSON.stringify(message));
		util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
		
		groups.groupsGetFriends(message, function(err, res){
			
			cnn.publish(m.replyTo, res, {
				contentType:'application/json',
				contentEncoding:'utf-8',
				correlationId:m.correlationId
			});
		});
	});
});

cnn.queue('creategrp_queue', function(q){
	q.subscribe(function(message, headers, deliveryInfo, m){
		util.log(util.format( deliveryInfo.routingKey, message));
		util.log("Message: "+JSON.stringify(message));
		util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
		
		groups.createGroup(message, function(err, res){
			
			cnn.publish(m.replyTo, res, {
				contentType:'application/json',
				contentEncoding:'utf-8',
				correlationId:m.correlationId
			});
		});
	});
});

cnn.queue('showstatus_queue', function(q){
	q.subscribe(function(message, headers, deliveryInfo, m){
		util.log(util.format( deliveryInfo.routingKey, message));
		util.log("Message: "+JSON.stringify(message));
		util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
		
		homepage.getStatus(message, function(err, res){
			
			cnn.publish(m.replyTo, res, {
				contentType:'application/json',
				contentEncoding:'utf-8',
				correlationId:m.correlationId
			});
		});
	});
});

cnn.queue('poststatus_queue', function(q){
	q.subscribe(function(message, headers, deliveryInfo, m){
		util.log(util.format( deliveryInfo.routingKey, message));
		util.log("Message: "+JSON.stringify(message));
		util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
		
		homepage.postStatus(message, function(err, res){
			
			cnn.publish(m.replyTo, res, {
				contentType:'application/json',
				contentEncoding:'utf-8',
				correlationId:m.correlationId
			});
		});
	});
});

cnn.queue('about_queue', function(q){
	q.subscribe(function(message, headers, deliveryInfo, m){
		util.log(util.format( deliveryInfo.routingKey, message));
		util.log("Message: "+JSON.stringify(message));
		util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
		
		about.getAbout(message, function(err, res){
			
			cnn.publish(m.replyTo, res, {
				contentType:'application/json',
				contentEncoding:'utf-8',
				correlationId:m.correlationId
			});
		});
	});
});

cnn.queue('editabout_queue', function(q){
	q.subscribe(function(message, headers, deliveryInfo, m){
		util.log(util.format( deliveryInfo.routingKey, message));
		util.log("Message: "+JSON.stringify(message));
		util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
		
		about.submitAbout(message, function(err, res){
			
			cnn.publish(m.replyTo, res, {
				contentType:'application/json',
				contentEncoding:'utf-8',
				correlationId:m.correlationId
			});
		});
	});
});

});