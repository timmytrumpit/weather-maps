
//location = canberra
var liveLocation = '-35.184708, 149.132538';

var urlOriginal = 'https://api.darksky.net/forecast/' + key + '/37.8267,-122.4233';

//this is the dark sky api call
var url = 'https://api.darksky.net/forecast/' + key + '/' + liveLocation + '?units=auto&callback=?';

var globalLat = '';
var globalLng = '';

var row = $('.list');

function replaceForecast() {

  console.log(row)
  row.html('');
  console.log(row)

}

// define coordinates for major australian cities
function getNav() {
  console.log('woop')

  var cityCoord = [
                    { city: "My Location", lat: globalLat, lng: globalLng },
                    { city: "canberra", lat: -35.184708, lng: 149.132538 },
                    { city: "sydney", lat: -33.8688, lng: 151.2093 },
                    { city: "brisbane", lat: -27.4698, lng: 153.0251 },
                    { city: "darwin", lat: -12.4634, lng: 130.8456 },
                    { city: "perth", lat: -31.9505, lng: 115.8605 },
                    { city: "adelaide", lat: -34.9285, lng: 138.6007 },
                    { city: "hobart", lat: -42.8821, lng: 147.3272 },
                    { city: "melbourne", lat: -37.8136, lng: 144.9631}
                  ];

  for (var i = 0; i < 9; i++) {

    var row = $('.cities');
    row.append("<li id='"+ i +"' class='cityOption'>" + cityCoord[i].city + "</li>");
  }

  $('.cityOption').click(function changeLocation(e) {

    var changeLocation = cityCoord[e.target.id];

    globalLat = cityCoord[e.target.id].lat;
    globalLng = cityCoord[e.target.id].lng;

    replaceForecast()

    var newWeatherLoca = globalLat + ',' + globalLng;
    url = 'https://api.darksky.net/forecast/' + key + '/' + newWeatherLoca + '?units=auto';
    getWeatherData(newWeatherLoca);
    initMap();


    // disable loader after map loads
    $( "#loader" ).hide();
  });
};

function initMap() {
  var styledMapType = new google.maps.StyledMapType([
       {
           "featureType": "administrative",
           "elementType": "labels.text.fill",
           "stylers": [
               {
                   "color": "#444444"
               }
           ]
       },
       {
           "featureType": "landscape",
           "elementType": "all",
           "stylers": [
               {
                   "color": "#f2f2f2"
               }
           ]
       },
       {
           "featureType": "poi",
           "elementType": "all",
           "stylers": [
               {
                   "visibility": "off"
               }
           ]
       },
       {
           "featureType": "road",
           "elementType": "all",
           "stylers": [
               {
                   "saturation": -100
               },
               {
                   "lightness": 45
               }
           ]
       },
       {
           "featureType": "road.highway",
           "elementType": "all",
           "stylers": [
               {
                   "visibility": "simplified"
               }
           ]
       },
       {
           "featureType": "road.highway",
           "elementType": "geometry.fill",
           "stylers": [
               {
                   "color": "#ffffff"
               }
           ]
       },
       {
           "featureType": "road.arterial",
           "elementType": "labels.icon",
           "stylers": [
               {
                   "visibility": "off"
               }
           ]
       },
       {
           "featureType": "transit",
           "elementType": "all",
           "stylers": [
               {
                   "visibility": "off"
               }
           ]
       },
       {
           "featureType": "water",
           "elementType": "all",
           "stylers": [
               {
                   "color": "#dde6e8"
               },
               {
                   "visibility": "on"
               }
           ]
       }
   ],
    {name: 'Weather Maps'});

  // defining map options to be displayed
 var map = new google.maps.Map(document.getElementById('map'), {
       center: { lat:globalLat, lng:globalLng },
       zoom: 11,
       disableDefaultUI: true,
       mapTypeControlOptions: {
       mapTypeIds: ['styled_map']
      }
     });

     // displaying map
      map.mapTypes.set('styled_map', styledMapType);
      map.setMapTypeId('styled_map');
}

function getUserLocation() {

  //geolocation function/if statement
  if (navigator.geolocation) {

      //success function which is called below
      function success(pos) {

        // finding coordinates
        var crd = pos.coords;



        globalLat = crd.latitude
        globalLng = crd.longitude

        // forammtted to be used to retireve api with geolocation
        liveLocation = globalLat + ',' + globalLng;

        //get api with new location
        getNav();

        getWeatherData(liveLocation);

        initMap();
}


      // error message in case geolocation is blocked, in console for my reference
      function error(err) {
        console.warn('ERROR (' + err.code + '):' + err.message)

        globalLat = -35.184708
        globalLng = 149.132538


        //call api with canberra as back up
        getWeatherData(liveLocation);

        initMap()

        getNav()

      }

      //this is the line that prompts the user for their location
      navigator.geolocation.getCurrentPosition(success, error);

      //if user location not found, show error
  } else {
    showError();
  };

};


// function which retrieves data
function getWeatherData(liveLocation){

  //now go get data
  $.getJSON(url, function(data) {
    console.log(data);

      //define the icon
      var icon = data.currently.icon;

      //formatting icon image to html
      var iconImage = '<img src="images/' + icon + '.svg" alt="' + icon + '" class="img"/>';

      //get the current temp
      var currentTemp = data.currently.temperature;

      //make html tag
      var currently = $('<h1>').html(iconImage + ' ' + Math.round(currentTemp) + '&deg');

      //append to body
      $('.currently').html(currently);

      //looping through data, adding to forecast
      for (var i = 1; i < data.daily.data.length; i++) {

        var forecast = data.daily.data[i]; //data for one day

      // target ul with the class .list



      // display correct day according to forecast data from Dark Sky
      var day = new Date(forecast.time*1000);

      // array with days of the week to be be displayed aside weather data
      var weekday = new Array(7);
          weekday[0] = "Sunday";
          weekday[1] = "Monday";
          weekday[2] = "Tuesday";
          weekday[3] = "Wednesday";
          weekday[4] = "Thursday";
          weekday[5] = "Friday";
          weekday[6] = "Saturday";

      var dailyIcon = forecast.icon


      var dailyIconImage = '<img src="images/' + dailyIcon + '.svg" alt="' + dailyIcon + '" class="img"/>'


      // appending list items to the class .list
      row.append("<li>" + dailyIconImage + ' ' + Math.round(forecast.temperatureMax) + '&deg' + ' ' + "<span>" + weekday[day.getDay()] + "</span>" + "</li>");

      // append forecast


    }
        $('.forecast').html(row);

      // See forecast from drop down action
        $( ".dropdown" ).click(function expandDataDisplay() {

          // dynamic styling for the toggled states of .forecast
          $( ".forecast").toggleClass( "forecast" )

          // dynamic styling for the toggled states of #weather
          $( "#weather" ).toggleClass( "expand" )

          // $( "#nav" ).toggleClass( "active" )

        });

        // disable loader after map loads
        $( "#loader" ).hide();
  });

};

//startup!
getUserLocation()
