var express = require('express');
var middleware = require('./config/middleware.js');
var http = require('http');
var Q = require('q');
var keys = require('./config/keys.js');

app = express();
middleware(app,express);

app.use(express.static(__dirname + '/../client'));


//Handle a POST request
//api/getNeighbors
app.post('/api/getNeighbors', function (req, res) {
	console.log('server.js says: POST request received! Data:', req.body);
	var searchInfo = req.body;
	var glanceCards = [];

	zilpy(searchInfo)
	.then(function (zilpyData){
		res.send(200, zilpyData);
	})
	.then(function () {
		reverseGeocode(searchInfo);
	});
});


//-----------------------------------------------------------------------------------
//GET Rent estimate High/Low
/*Prerequisites:
	Street Address, Bedrooms, Bathrooms
  Website: zilpy.com

  Input: searchInfo object
  Output: zilpyData object
*/

var zilpy = function (searchInfo) {
	var deferred = Q.defer();

	var zilpyUrl_address = 'http://api-stage.zilpy.com/property/-/rent/newreport?addr='
	var zilpyUrl_bedrooms = '&ptype=single_family_house&bdr='
	var zilpyUrl_bathrooms = '&ba=';

	var zilpyUrl = zilpyUrl_address + searchInfo.address + zilpyUrl_bedrooms + searchInfo.bedrooms + zilpyUrl_bathrooms + searchInfo.bathrooms;
	console.log('Sample URL for Zilpy:', zilpyUrl);

	http.get( zilpyUrl, function (response) {
	    var body = '';
	    response.on('data', function (chunk) {
	      body += chunk;
	    });
	    response.on('end', function () {
	      //remove
	      //console.log('Zilpy data - BODY: ' + body);
		  	deferred.resolve(body);
	    });
	}); //end of http.get

	return deferred.promise;
}


//-----------------------------------------------------------------------------------
//GET latitude and longitude of an address, given the address
/*Prerequisites:
	Street Address
  Website: Google maps endpoint

  Input: searchInfo
  Output: [latitude, longitude]
*/

var reverseGeocode = function (searchInfo) {
	var deferred = Q.defer();

	var address = searchInfo.address;
	var gPlacesUrl_address = 'http://maps.googleapis.com/maps/api/geocode/json?address=';
	var gPlacesUrl_sensor = '&sensor=false';

	console.log('server.js says: reverseGeocode called.');
	console.log('address: ',address);
	console.log('googleAPIKey: ',keys.googleAPIKey);

	var gPlacesUrl = gPlacesUrl_address + address + gPlacesUrl_sensor;
	http.get( gPlacesUrl, function (response) {
		var body = '';
		response.on('data', function (chunk) {
			body += chunk;
		});
		response.on('end', function () {
			body = JSON.parse(body);
			console.log('Response from reverseGeocode:',typeof body);
			console.log('Content:', body);
			deferred.resolve(body);
		});
	}); //end of http.get

	return deferred.promise;
}




//-----------------------------------------------------------------------------------
//GET neighborhood list, given a particular latitude and longitude
/*Prerequisites:
	Street Address
  Website: Google places
*/





module.exports = app;