var opbeat = require('opbeat').start()

// modules go here
var cool = require('cool-ascii-faces');
var moment = require('moment');
var req = require('request');

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

app.post('/asanatasks', function(request, response) {


  // pull task from asana
		  var options = {
		  method: "GET",
		  url: 'https://app.asana.com/api/1.0/tasks?opt_fields=id,due_on,name,notes,projects&assignee=10293349666829&completed_since=now&limit=10&workspace=64385798792062',
		  headers: {
		    'Authorization': 'Bearer 0/d1b679d62915f096030442a49841eddf'
		  }
		};
		
		var asanaData;
		function callback(error, response, body) {
		  if (!error && response.statusCode == 200) {
		    var info = JSON.parse(body);
		    asanaData = info;
		    processData(asanaData);
		   //console.log(info);
		  } else {
		  	//console.log(error);
		  }
		};
		 
		req(options, callback);

		  // sort them by date

function processData (d) {

	var data = d.data;
	var baseLink = "https://app.asana.com/0/64385821639033/";
	var processed = [];
	var noDate = [];

	for (var i = data.length - 1; i >= 0; i--) {
	  
	  var obj = {};

	  var name = data[i].name;
	  var link = baseLink + data[i].id;
	  

	  obj.name = name;
	 
	  obj.link = link;

	  if (data[i].due_on == null) {
	    var mom = "No Due Date";
	    obj.mom = mom;
	    noDate.push(obj);
	  } else {
	  var due = new Date(data[i].due_on);
	  var mom = moment(due).fromNow();
	  obj.mom = mom;
	  obj.due = due;
	  processed.push(obj);
	   
	  };
	  
	};

	processed.sort(function (a, b) {
	  if (a.due > b.due) {
	    return 1;
	  }
	  if (a.due < b.due) {
	    return -1;
	  }
	  // a must be equal to b
	  return 0;
	});

	//console.log(processed);
	//console.log(noDate);
	compilehtml(processed,noDate);

	};






  //compile the html for the slack message
  var html;
  function compilehtml (p,n) {
  	 html = "";
    for (var i = 0 ; i <= p.length - 1; i++) {
      
      var task = "*" + p[i].name + "* _due "+ p[i].mom + "_ <" + p[i].link + "|View>\n";
      html = html + task;
    };
    html = html + ""
  	console.log(html);
  };



  response.status(200).send(html);
});



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


