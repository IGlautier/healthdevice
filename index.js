var app = require('http').createServer(handler), io = require('socket.io').listen(app), xml2js = require('xml2js'), parser = new xml2js.Parser(), fs = require('fs'), router = require("./router"), requestHandlers = require("./requestHandlers"), url = require("url");

var handle = {};
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/config"] = requestHandlers.config;
handle["/data"] = requestHandlers.data;

// creating the server ( localhost:80 ) 
app.listen(80);

// on server started we can load our client.html page
function handler ( request, response ) {
    var postData = "";
  var pathname = url.parse(request.url).pathname;
	console.log("Request for " + pathname + " received.");
	request.setEncoding("utf8");
	request.addListener("data", function(postDataChunk) {
	  postData += postDataChunk;
	  console.log("Received POST data chunk '"+
	  postDataChunk + "'.");
	});
	request.addListener("end", function() {
	  router.route(handle, pathname, response, postData);
	});
};

// creating a new websocket to keep the content updated without any AJAX request
io.sockets.on( 'connection', function ( socket ) {
  console.log(__dirname);
  // watching the xml file
  fs.watch( __dirname + '/data.json', function ( curr, prev ) {
	// on file change we can read the new xml
	console.log(curr);
	  fs.readFile( __dirname + '/data.json', function ( err, data ) {
	  if ( err ) throw err;
	  // parsing the new json data and converting them into json 
	  var result = JSON.parse(data);		
	  result.time = new Date();
	  socket.volatile.emit( 'newData' , result );
	  
  });
  });
});
