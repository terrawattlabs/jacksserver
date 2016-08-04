var opbeat = require('opbeat').start()

// modules go here
var cool = require('cool-ascii-faces');
var moment = require('moment');
var request = require('request');

// end modules


var express = require('express');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(opbeat.middleware.express())

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/cool', function(request, response) {
  response.send(cool());
});

app.get('/asanatasks', function(request, response) {
  var html = "hello!";

  // pull task from asana
		  var options = {
		  url: 'https://app.asana.com/api/1.0/tasks?opt_fields=id,due_on,name,notes,projects&assignee=10293349666829&limit=10&workspace=64385798792062',
		  headers: {
		    'Authorization': 'Bearer 0/d1b679d62915f096030442a49841eddf'
		  }
		};
		 
		function callback(error, response, body) {
		  if (!error && response.statusCode == 200) {
		    var info = JSON.parse(body);
		   console.log(info);
		  } else {
		  	console.log(error);
		  }
		};
		 
		request.get(options, callback);

  // sort them by date

  //compile the html for the slack message


  response.send(html);
});



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


