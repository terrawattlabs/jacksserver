// greetings.js
var moment = require('moment');
var req = require('request');

var exports = module.exports = {};
        
exports.pulltasks = function() {
	// pull projects

	var projectList;




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
		    console.log(info);
		    projectList = info;
		    
		  } else {
		  	console.log(error);
		  }
		};
		 
		req(options, callback);

return projectList;

  
};
   
exports.sayHelloInSpanish = function() {
  return "Hola";
};