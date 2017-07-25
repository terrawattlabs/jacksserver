var opbeat = require('opbeat').start()

// modules go here
var RSVP = require('rsvp');
var cool = require('cool-ascii-faces');
var moment = require('moment');
var req = require('request');
var greetings = require("./custom/greetings.js");
var asana = require("./custom/asana.js");
var shortid = require('shortid');
var Promise = require('promise');
var cors = require('cors');
var Converter = require("csvtojson").Converter;
var fs = require("fs"); 
var ba = require('beeradvocate-api');


// end modules


var express = require('express');
var bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

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
		var user_token;
		var user_id;
		var user_email;
		var user_name;
		var user_refresh_token;





	req.post({url:'https://app.asana.com/-/oauth_token', 
		form: {
                grant_type: 'authorization_code',
                client_id: '192803788558688',
                client_secret: 'e23526b7eb519cdfb53459eed6737e52',
                redirect_uri: 'https://jacksserver.herokuapp.com/magictask/asana/auth',
                code: c
            }}, 
		function(err,httpResponse,body){

			console.log(body.aaccess_token);
			var jsonbody = JSON.parse(body);
			console.log(jsonbody);

			user_token = jsonbody.access_token;
			user_id = jsonbody.data.id;
			user_email = jsonbody.data.email;
			user_name = jsonbody.data.name;
			user_refresh_token = jsonbody.refresh_token;
			var respURL = "https://magic-task.stamplayapp.com/#/success/asana" 
			+ "?token=" + user_token
			+ "&id=" + user_id
			+ "&email=" + user_email
			+ "&name=" + user_name
			+ "&refresh=" + user_refresh_token;


			output(respURL);
	});

	function output(u){
		response.writeHead(301,
			  {Location: u}
			);
			response.end();
		// response.send('i think it worked');
	};

		
   
});

app.post('/magictask/asana/refresh', function(request, response) {
	response.set('Access-Control-Allow-Origin', '*');

	
		console.log(request.body.refresh);
		var refresh = request.body.refresh;
		

	req.post({url:'https://app.asana.com/-/oauth_token', 
		form: {
                grant_type: 'refresh_token',
                client_id: '192803788558688',
                client_secret: 'e23526b7eb519cdfb53459eed6737e52',
                redirect_uri: 'https://jacksserver.herokuapp.com/magictask/asana/auth',
                refresh_token: refresh
            }}, 
		function(err,httpResponse,body){

			console.log(body.aaccess_token);
			var jsonbody = JSON.parse(body);
			console.log(jsonbody);


			output(jsonbody,err);
	});

	function output(d,err){
		response.status(200).json(d);
		
	};

		
   
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



// referral for Clear Estimates. To be moved to a new server later

app.post('/refersion', function(request, response) {
		
		//CSV File Path or CSV String or Readable Stream Object
			var csvFileName = request.body.public_url;

		//new converter instance
			var csvConverter = new Converter({});

		//end_parsed will be emitted once parsing finished
			csvConverter.on("end_parsed",function(jsonObj){
			    console.log(jsonObj); //here is your result json object
			});

		//read from file
			fs.createReadStream(csvFileName).pipe(csvConverter);

	response.sendStatus(200);
});



// Green Panel MVP 

app.get('/terrawatt', function(request, response) {
  response.send(request.query.email);

  	var data = {
  		email: request.query.email,
  		name: request.query.name,
  		customerid: request.query.customerid,
  		answer: request.query.answer
  	}

  	 var options = {
		  method: "POST",
		  url: 'https://hooks.zapier.com/hooks/catch/1071793/6vyufz/',
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

// beer calculator

app.get('/beer', function(request, response) {

	ba.beerSearch("Two Hearted", function(beers) {
    	
	});
	response.send(beers);
  
});



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});




