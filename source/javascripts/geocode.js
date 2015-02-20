'use strict'
/*
Geocoder API version 0.1
Geocoder will be responsible for
1. Getting the closest possible geolocation of the device
2. Calculate distance geocode wise
3. Use Google geocode for travel distance calculation

Dependencies:

1. Must load jQuery before loading the script: it uses $.ajax for calls
2. Must load google api script before using any methods that uses distance calculation
sample script: <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=<% YOUR_GOOGLE_API_KEY %>"></script>

Note: Make sure you have activated location services from the google API console before you start to use its services

*/
;
(function(root) {

	var init = function(params) {
		this.isverbose = params.verbose;
		this.log = function(message) {
			if (!this.isverbose)
				return true;
			console.log(message);
			return true;
		};
	};
	//Configurations holder
	var config = {
		ip_endpoint: 'http://ip-api.com/json'
	};
	init.call(config, {
		verbose: true
	});

	//Attempts to get by navigator.get
	var getLocationByGeo = function(callback) {
		if (!(navigator && navigator.geolocation))
			config.log("Geo location denied") && callback(false);
		navigator.geolocation.getCurrentPosition(function(data) {
			callback([data.coords.latitude, data.coords.longitude]);
		}, function(err) {
			callback(false)
		});
	};

	var getLocationByIP = function(callback) {
		$.ajax({
			url: config.ip_endpoint,
			dataType: 'json',
			success: function(data) {
				if (data.success != "success")
					callback(false);
				callback([data.lat, data.lon]);
			},
			error: function(XMLHttpRequest, textStatus, errorThrow) {
				config.log("Error happened in fetching location from IP: ", errorThrow) && callback(false);
			}
		});
		return true;
	};

	var objToQuery = function(obj) {
		var query_comps = [];
		for (var iter in obj) {
			if (!obj.hasOwnProperty(iter))
				continue;
			query_comps.push(obj[iter] instanceof Array ? (iter + '=' + obj[iter].join(",")) : (iter + "=" + obj[iter]));
		}
		return query_comps.join("&")
	};

	//Takes array of user provided destinations, sorts 
	var sortByNearest = function(destinations) {
		//Since is one origin to multiple destinations mapping
		destinations.sort(function(des1, des2){
			return (des1.distance_details["status"] == "OK") ? (des2.distance_details["status"] == "OK" ? (des1.distance_details.distance.value > des2.distance_details.distance.value) : false) : true;
		});
		return destinations;
	}

	var getNearestDestination = function(origin, destinations, callback) {

		origin = new google.maps.LatLng(origin[0], origin[1]);
		var dest_geocodes = [];
		destinations.forEach(function(destination, index) {
			dest_geocodes[index] = destination.geocode ? new google.maps.LatLng(destination.geocode[0], destination.geocode[1]) : (destination.name);
		});

		var service = new google.maps.DistanceMatrixService();
		console.log("destinations to google geocode")
		service.getDistanceMatrix({
			origins: [origin],
			destinations: dest_geocodes,
			travelMode: google.maps.TravelMode.TRANSIT,
		}, function(data){
				destinations.forEach(function(destination, index){
					destination["distance_details"] = (data.rows.length && data.rows[0].elements[index] ? data.rows[0].elements[index] : 'NA');
				});
			var sorted_destinations = sortByNearest(destinations);
			callback(sorted_destinations);
		});
	};

	var geocoder = {
		/*

		---------------------------------
		geocoder.getLocation()
		---------------------------------
		sample call format: geocoder.getLocation(function(data{console.log(data)}));

		Gets the geocode for browser location
		Sample output format: [12.9833, 77.5833]
		*/
		getLocation: function(callback) {
			getLocationByGeo(function(data) {
				if (!data)
					getLocationByIP(callback);
				else
					callback(data);
			});
		},
		init: function() {

		},
		
		/*

		---------------------------------
		geocoder.getNearestDestination()
		---------------------------------

		sample call format:  geocoder.getNearestDestination([34.109787, -117.710664], [{"geocode"		: [34.032085, -118.496072]}, {"geocode"		: [33.614928, -117.874727]}, {"geocode"		:	[34.081362, -118.063945]}] , function(data){console.log(data)});

		Calculates distance between one origin and different destinations individually and sorts them by distance in ascending order
		If origin is to be picked by browser location pass origin as null to the function

		____________________________________________________________________

		Request format:

		origin 			-> lat and long in array format e.g. - origin = [34.109787, -117.710664]
		destination -> array of destination objects. Every destination object must have 
									 either attribute geocode or name attribute which google can use 
									 to locate the destination.
									 For e.g. -
										destinations = [
																{
																	"name" 			: "Santa Monica",
																	"address1" 	: "1230 Montana Ave.",
																	"address2"	: "Suite 101",
																	"city_state": "Santa Monica, CA",
																	"zipcode" 	: "90403",
																	"contact"		: ["310-319-9400"],
																	"email"			: ["santamonica@skinlaundry.com"],
																	"geocode"		: [34.032085, -118.496072]
																},
																{
																	"name" 		: "Newport Beach",
																	"address1" 	: "123 Newport Center Dr.",
																	"address2"	: "",
																	"city_state": "Newport Beach, CA",
																	"zipcode" 	: "92660",
																	"contact"		: ["949-706-7203"],
																	"email"			: ["newportbeach@skinlaundry.com"],
																	"geocode"		: [33.614928, -117.874727]
																},
																{
																	"key" : "rosemead",
																	"name" 		: "Rosemead",
																	"address1" 	: "9428 Valley Blvd.",
																	"address2"	: "Suite 201",
																	"city_state": "Rosemead, CA",
																	"zipcode" 	: "91770",
																	"contact"		: ["626-416-4585"],
																	"email"			:	["rosemead@skinlaundry.com"],
																	"geocode"		:	[34.081362, -118.063945]
																}
															] //End of array destinations

			callback -> the function which will will recieve the sorted list of destinations
			______________________________________________________________

			Sample response format: 

				For the following call: geocoder.getNearestDestination([34.109787, -117.710664], destinations , function(data){console.log(data)});
				will be like (destinations for this sample is same as destination array specified above)
					[
						  {
						    "key": "rosemead",
						    "name": "Rosemead",
						    "address1": "9428 Valley Blvd.",
						    "address2": "Suite 201",
						    "city_state": "Rosemead, CA",
						    "zipcode": "91770",
						    "contact": [
						      "626-416-4585"
						    ],
						    "email": [
						      "rosemead@skinlaundry.com"
						    ],
						    "geocode": [
						      34.081362,
						      -118.063945
						    ],
						    "distance_details": {
						      "distance": {
						        "text": "38.1 km",
						        "value": 38084
						      },
						      "duration": {
						        "text": "1 hour 9 mins",
						        "value": 4162
						      },
						      "status": "OK"
						    }
						  },
						  {
						    "name": "Santa Monica",
						    "address1": "1230 Montana Ave.",
						    "address2": "Suite 101",
						    "city_state": "Santa Monica, CA",
						    "zipcode": "90403",
						    "contact": [
						      "310-319-9400"
						    ],
						    "email": [
						      "santamonica@skinlaundry.com"
						    ],
						    "geocode": [
						      34.032085,
						      -118.496072
						    ],
						    "distance_details": {
						      "distance": {
						        "text": "82.4 km",
						        "value": 82448
						      },
						      "duration": {
						        "text": "2 hours 35 mins",
						        "value": 9272
						      },
						      "status": "OK"
						    }
						  },
						  {
						    "name": "Newport Beach",
						    "address1": "123 Newport Center Dr.",
						    "address2": "",
						    "city_state": "Newport Beach, CA",
						    "zipcode": "92660",
						    "contact": [
						      "949-706-7203"
						    ],
						    "email": [
						      "newportbeach@skinlaundry.com"
						    ],
						    "geocode": [
						      33.614928,
						      -117.874727
						    ],
						    "distance_details": {
						      "distance": {
						        "text": "142 km",
						        "value": 141959
						      },
						      "duration": {
						        "text": "3 hours 36 mins",
						        "value": 12965
						      },
						      "fare": {
						        "currency": "USD",
						        "value": 13.5
						      },
						      "status": "OK"
						    }
						  }
					]
		*/
		getNearestDestination: function(origin, destinations, callback) {
			if (!destinations)
				config.log("Destinations blank. Cannot proceed") && callback(false);
			if (!origin)
				this.getLocation(function(data) {
					origin = data;
					getNearestDestination( origin, destinations, callback );
				});
			else
				getNearestDestination( origin, destinations, callback );
		}
	};
	root.geocoder = geocoder;
	return geocoder;

})(window);