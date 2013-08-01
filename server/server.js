var http = require("http"); // Include http
var url = require("url"); //Include url path browser
var io = require('socket.io');

function start(route, handle) {
  var server = http.createServer(function(request, response) { // function to create server
	  var pathname = url.parse(request.url).pathname;
	  console.log("Request for " + pathname + " received");
	  route(handle, pathname, response);
	  
	}).listen(80); // Listen on port 80
	console.log("Server Started");
	var updater = io.listen(server);
	
}


//exports.updater = updater;
exports.start = start;
