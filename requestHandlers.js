var fs = require('fs'), xml2js = require('xml2js'), parser = new xml2js.Parser();

function start(response, postData) {
  console.log("Request handler 'start' was called");
	fs.readFile('client.html', 'utf8', function(err, data) {
	   if (err) {
		console.log(err);
	   }
	   response.writeHead(200, {"Content-Type": "text/html"});
	   response.write(data);
	   response.end();
	});
}
function data(response, postData) {
	var data = require('./data.json');
	console.log("Request handler 'data' was called");
	var highest = 0;
	for (var time in data.device[postData]) {
		if (time > highest) highest = time;
	}
	var latest = JSON.stringify(data.device[postData][highest]);
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write(latest);
	response.end();
}
function upload(response, postData) {
    var deviceList = require("./devices.json");
	console.log("Request handler 'upload' was called");
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write("OK");
	response.end();
	if (postData != "") {
		parser.parseString( postData, function(err, result) {
			if (err) throw err;
			fs.readFile('data.json', function (err, data) {
			  console.log("reading data file");
			  if (err) throw err;
			  var parsedData = JSON.parse(data);
			  
			  var deviceType = result["HMM_XmlDataFile"].DataList[0]["$"]["dataType"];
			  console.log("device type: " + deviceType);
			  
			  for (var i = 0; i < result["HMM_XmlDataFile"].DataList[0]["Data_Value"].length; i++) {
			    var timeStamp = result["HMM_XmlDataFile"].DataList[0]["Data_Value"][i]["$"].dateTimestamp;
				parsedData.device[deviceType][timeStamp] = new Object();
				for (var j = 0; j < Object.keys(deviceList.deviceID[deviceType].lookupPaths).length; j++) {
				    var itemPath = deviceList.deviceID[deviceType].lookupPaths[j];
					parsedData.device[deviceType][timeStamp][itemPath] = result["HMM_XmlDataFile"].DataList[0]["Data_Value"][i]["$"][itemPath];
				}
			  }
			  var updatedData = JSON.stringify(parsedData);
			  fs.writeFile('data.json', updatedData, function(err, result) {
				if (err) throw err;
				console.log(err);
			  });
			});
		});
	}
}

function config(response, postData) {
	console.log("Request handler 'config' was called");
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write("OK");
	response.end();
}

exports.start = start;
exports.upload = upload;
exports.config = config;
exports.data = data;
