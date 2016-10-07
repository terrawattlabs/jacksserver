var opbeat = require('opbeat').start()

// modules go here
var RSVP = require('rsvp');
var cool = require('cool-ascii-faces');
var moment = require('moment');
var req = require('request');
var greetings = require("./custom/greetings.js");
var asana = require("./custom/asana.js");
var shortid = require('shortid');

// end modules


var express = require('express');
var bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(opbeat.middleware.express());

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/cool', function(request, response) {
  response.send(cool());
});

app.get('/magictask/createid', function(request, response) {
  response.send(shortid.generate());

  	 var options = {
		  method: "POST",
		  url: 'https://app.asana.com/-/oauth_token',
		  headers: {},
		  json: data
		};
		
		 var callback = function (error, response, body){
		 	if (!error && response.statusCode == 200) {
			   
			console.log('ran callback');

	
		  } else {
		  	console.log(error);
		  }

		 };

		req(options, callback);


});

// magic task

app.post('/magictask/newsignup', function(request,response){
		
	console.log(request.body);	
	var id = shortid.generate();
	var data = {"email": 
	request.body.email, 
	"referrer": request.body.referrer,
	"uniqueid": id
	};

	 var options = {
		  method: "POST",
		  url: 'https://hooks.zapier.com/hooks/catch/1071793/6z7nh2/',
		  headers: {},
		  json: data
		};
		
		 var callback = function (error, response, body){
		 	if (!error && response.statusCode == 200) {
			   
			console.log('ran callback');

	
		  } else {
		  	console.log(error);
		  }

		 };

		req(options, callback);



	response.send(id);
});

app.get('/magictask/asana/auth', function(request, response) {

		console.log(request.query.code);

		var c = request.query.code;

	req.post({url:'https://app.asana.com/-/oauth_token', 
		form: {
                grant_type: 'authorization_code',
                client_id: '192803788558688',
                client_secret: 'e23526b7eb519cdfb53459eed6737e52',
                redirect_uri: 'https://jacksserver.herokuapp.com/magictask/asana/auth',
                code: c
            }}, 
		function(err,httpResponse,body){
		console.log(err);
		console.log(httpResponse);
		console.log(body);
	});

		response.send('it worked I think');
   
});




//magic task

app.get('/greetings', function(request, response) {

		response.send(asana.pulltasks())
   
});

app.get('/taskwidget', function(request, response) {
	  	

  response.send(asana.pulltasks());
});

app.post('/asanatasks', function(request, response) {


		// pull projects
	  function pullProjects() {


		  var options = {
		  method: "GET",
		  url: 'https://app.asana.com/api/1.0/workspaces/64385798792062/projects?opt_fields=color,name&limit=10',
		  headers: {
		    'Authorization': 'Bearer 0/d1b679d62915f096030442a49841eddf'
		  }
		};
		
		function callback(error, response, body) {
		  if (!error && response.statusCode == 200) {
		    var info = JSON.parse(body);
		    //console.log(info);
		    pullData(info);
		  } else {
		  	console.log(error);
		  }
		};
		 
		req(options, callback);

	 };

	 pullProjects();
	 

  // pull task from asana
  function pullData(proj) {


		  var options = {
		  method: "GET",
		  url: 'https://app.asana.com/api/1.0/tasks?opt_fields=id,due_on,name,notes,projects&assignee=10293349666829&completed_since=now&limit=20&workspace=64385798792062',
		  headers: {
		    'Authorization': 'Bearer 0/d1b679d62915f096030442a49841eddf'
		  }
		};
		
		var asanaData;
		function callback(error, response, body) {
		  if (!error && response.statusCode == 200) {
		    var info = JSON.parse(body);
		    asanaData = info;
		    //console.log(asanaData);
		    processData(asanaData,proj);
		   //console.log(info);
		  } else {
		  	//console.log(error);
		  }
		};
		 
		req(options, callback);

	 };


		  // sort them by date

function search(n, a){
    for (var i=0; i < a.length; i++) {
        if (a[i].id === n) {
            return a[i];
        }
    }
};


function processData (d, p) {

	var projectList = p.data;
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
	  var due = moment(data[i].due_on).hour(23).minute(59);
    var mom = due.fromNow();
    var cal = due.calendar(null, {
          sameDay: '[Today]',
          nextDay: '[Tomorrow]',
          nextWeek: 'dddd',
          lastDay: '[Yesterday]',
          lastWeek: '[Last] dddd',
          sameElse: 'MMM Do'
      });

    var proj = search(data[i].projects[0].id, projectList);

    obj.projName = proj.name;
    obj.projColor = proj.color;

      obj.cal = cal;
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
	//compilehtml(processed,noDate);
	compileAttachment(processed,noDate);

	};

	


var testing = {
    "text": "This is a line of text.\nAnd this is another one.",
    "attachments": [
        {
            "fallback": "Required plain-text summary of the attachment.",
            "color": "#36a64f",
            "pretext": "Optional text that appears above the attachment block",
            "author_name": "Bobby Tables",
            "author_link": "http://flickr.com/bobby/",
            "author_icon": "http://flickr.com/icons/bobby.jpg",
            "title": "Slack API Documentation",
            "title_link": "https://api.slack.com/",
            "text": "Optional text that appears within the attachment",
            "fields": [
                {
                    "title": "Priority",
                    "value": "High",
                    "short": false
                }
            ],
            "image_url": "http://my-website.com/path/to/image.jpg",
            "thumb_url": "http://example.com/path/to/thumb.png",
            "footer": "Slack API",
            "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
            "ts": 123456789
        }

    ]
};


var tasks = {
	 "text" : "*Here's What I Found:*"
};

var attachmentsArray = [];

function compileAttachment (p, n) {
	
	for (var i = 0 ; i <= 4; i++) {
		var aObj = {};
		aObj.fallback = "Required plain-text summary of the attachment.";
		aObj.color = p[i].projColor;
		aObj.title = p[i].name;
		aObj.title_link = p[i].link;
		var fieldsArray = [];
		var dueObj = {};
		dueObj.title = "Due";
		dueObj.value = p[i].cal;
		fieldsArray.push(dueObj);
		aObj.fields = fieldsArray;
		attachmentsArray.push(aObj);
    };
    tasks.attachments = attachmentsArray;
    response.status(200).send(tasks);
};



  //compile the html for the slack message
  // var html;
  // function compilehtml (p,n) {
  // 	 html = "";
  //   for (var i = 0 ; i <= p.length - 1; i++) {
      
  //     var task = "*" + p[i].name + "* _due "+ p[i].mom + "_ <" + p[i].link + "|View>\n";
  //     html = html + task;
  //   };
  //   html = html + ""
  // 	console.log(html);
  // 	response.status(200).send(testing);
  // };



  
});

app.post('/slackinteractive', function(request, response) {


	
});



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


