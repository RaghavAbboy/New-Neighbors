angular.module('myApp',['myApp.mapServices', 'myApp.requestHoodServices'])
.controller('MainController', ['Map', 'ServerApi', function (Map, ServerApi){
  var main = this;

  main.neighborhoodsObj = {}; //this is the response from the server

  main.searchInfo = {}; // JSON obj to send to server
  main.searchInfo.address = '';
  main.searchInfo.buyOrRent = 'rent';
  main.searchInfo.bedrooms = 1;
  main.searchInfo.bathrooms = 1;
  main.searchInfo.maxRent = '';
  main.searchInfo.commuteTime = 30;
  main.searchInfo.commuteDistance = 30;


  main.orderByArray = function(neighborhoods){
    var arr = [];
    for (var i = 0; i < neighborhoods.length; i++) {
      arr.push({
          name: neighborhoods[i].name,
          commuteTime: neighborhoods[i].commuteInfo.commuteTime,
          commuteDistance: neighborhoods[i].commuteInfo.commuteDistance,
          estimateHigh: neighborhoods[i].rentEstimate.estimateHigh,
          estimateLow: neighborhoods[i].rentEstimate.estimateLow
      });
    }
    return arr;
  };

  main.coordinates = {
      latitude: 37.7833,
      longitude: -122.4167
  };

  //unscoped local variables
  var autocomplete;

  //----------------------------------------------------------------------------------
  //Function to initialize and draw the map, centering on the the center of the U.S. or user-inputted coordinates
  main.initMap = function() {
    //test coordinates
    Map.initialize(main.coordinates);
  };

  //Function to set the selected type of housing to 'rent'
  main.setValueRent = function() {
    main.searchInfo.buyOrRent = 'rent';
  };

  //Function to set the selected type of housing to 'buy'
  main.setValueBuy = function() {
    main.searchInfo.buyOrRent = 'buy';
  };

  //----------------------------------------------------------------------------------
  //Function to test new methods defined in mapService
  //remove
  main.testMap = function() {
    console.log('mainCtrl.js says: testMap called');  //make the submit button work
    Map.panAndFocus(main.coordinates);
    Map.dropMarker(main.coordinates);
  };

  //----------------------------------------------------------------------------------
  //Function to set up autocomplete feature for the search field
  main.autoCompleteInit = function () {
    var input = document.getElementById('place-search');
    var options = { types: [] };
    autocomplete = new google.maps.places.Autocomplete(input, options);

    //listener to listen to a place change
    autocomplete.addListener('place_changed', function() {
      var place = autocomplete.getPlace();
      console.log('mainCtrl.js says: Place changed. Place:',place.formatted_address);
      if(place.formatted_address || main.address.length > 0) {
        main.address = place.formatted_address || main.address;
        main.submitAddress();
      }
    });

  };

  //----------------------------------------------------------------------------------
  //Function to add a marker on the map
  main.addMarker = function (coordinates, title) {
    title = 'Test marker' || title;
    Map.dropMarker(coordinates, title);
  };


  //----------------------------------------------------------------------------------
  //Function to fetch address and validate it
  main.submitAddress = function() {
    // console.log('mainCtrl.js says: Submitted address (autocomplete):', place.formatted_address);
    console.log('mainCtrl.js says: Submitted address (angular):', main.address);

    main.searchInfo.address = main.address;
    main.searchInfo.bedrooms = main.bedrooms;
    main.searchInfo.bathrooms = main.bathrooms;
    main.searchInfo.buyOrRent = main.buyOrRent;


    // geocoder = new google.maps.Geocoder();
    // geocoder.geocode({ 'address': main.address }, function(results, status) {
    //   if (status == google.maps.GeocoderStatus.OK) {
    //     console.log(results[0].geometry.location);
    //     console.log('results address', results[0].formatted_address);
    //     if (!isNaN(results[0].formatted_address[0])) {
    //       main.searchInfo.address = results[0].formatted_address;
    //       // ServerApi.submit(main.searchInfo);
    //     } else {
    //       alert("Please insert a valid U.S. address");
    //     }
    //   } else {
    //     console.log('error: ', status, ' ', results)
    //   }
    // });

    main.testMap();
    requestNeighborhoods();
  };


  //----------------------------------------------------------------------------------
  // Function to make an API request for neighborhoods
  var requestNeighborhoods = function () {
    ServerApi.submit(main.searchInfo).then(function(data) {
     main.neighborhoods = Object.keys(data).map(function(key) {
       return data[key];
     });
     main.neighborhoodArray = main.orderByArray(main.neighborhoods);
     console.log('order by array', main.neighborhoodArray);

    });
  };

  //----------------------------------------------------------------------------------
  //Initialize the map view
  main.initMap();
  main.autoCompleteInit();

}]);













