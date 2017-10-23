
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , expressSession = require("express-session")
  , user = require('./routes/user')
  , signup = require('./routes/signup')
  , homepage = require('./routes/homepage')
  , searchuser = require('./routes/searchuser')
  , http = require('http')
  , path = require('path')
  , friends = require('./routes/friends')
  , groups = require('./routes/groups');

var app = express();
var mongoSessionConnectURL = "mongodb://localhost:27017/facebook" ;
var mongoStore = require("connect-mongo")(expressSession);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.methodOverride());
app.use(expressSession({
	secret: 'mySECRETstring',
	resave: false,  //don't save session if unmodified
	saveUninitialized: false,	// don't create session until something stored
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000,
	store: new mongoStore({
		url: mongoSessionConnectURL
	})
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/homepage', homepage.Homepage);
app.get('/getSearchedUsers', searchuser.getSearchedUsers);
app.post('/redirectToSearch', homepage.redirectToSearch);
app.get('/showSearch', searchuser.showSearch);
app.get('/getFriends', groups.getFriends);
app.get('/getFriendsList', friends.getFriendsList);
app.get('/friends', homepage.redirectToFriends);
app.get('/groups', homepage.redirectToGroups);
app.get('/getGroups', groups.getGroups);
app.get('/getStatuses', homepage.getStatuses);

app.post('/getGroupMembers', groups.getGroupMembers);
app.post('/deleteMember', groups.deleteMember);
app.post('/deleteGroup', groups.deleteGroup);
app.post('/createGroup', groups.createGroup);
app.post('/acceptRequest', friends.acceptRequest);
app.post('/searchAddFriend', searchuser.searchAddFriend);
app.post('/signup', signup.signup);
app.post('/signin', signup.signin);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
