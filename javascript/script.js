 /*      DECLARING GLOBALS       */
var map;
var geocoder;
var marker1;
var homePlace;
var curpos;
var currPlace;

var pano;

var temp = 0;

let api_key = "AIzaSyAtJor4eSuw3Wt8fLLYCfRrdK_AvAaQxHs";



var placeService;

let places = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=" + api_key + "&radius=";



var destinations = [];
var markerList = [];
var searcharea = new google.maps.Circle();


function calcDist(p1, p2) {
  var R = 6371e3; // radius of earth in metres
  var φ1 = degToRad(p1.lat());
  var φ2 = degToRad(p2.lat());
  var Δφ = degToRad((p2.lat()-p1.lat()));
  var Δλ = degToRad((p2.lng()-p1.lng()));

  var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ/2) * Math.sin(Δλ/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  var dist = R * c;

  return parseInt(dist);
}

function degToRad(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

class Place {
  name;
  address;
  types = [];
  location;
  constructor(json) {
    this.name = json.name;
    this.address = json.formatted_address;
    this.tags = json.tags;
    this.location = json.geometry.location;
  }

  setPlace(newPlace) {
    this.name = newPlace.name;
    this.address = newPlace.formatted_address;
    this.tags = newPlace.tags;
    this.location = newPlace.geometry.location;
  }
}


//Takes a human readable address and an index returns the goecoded LatLng of the result[index] or LatLng(0,0) if failed
function getLatLng(address, result_index = 0) {
  var output;
  geocoder.geocode({'address': address}, function(results, status) {
      if(status == 'OK') {
        console.log("Geocode for " + address + " successful: " + results[0].geometry.location);
        output = results[result_index].geometry.location;
      } else {
        console.log("Geocode for " + address +" failed");
        output = new google.maps.LatLng(0,0);
      }
  });
  console.log("Output: " + output);
  return output;
}

//This should be the first called funtion
//initialize the map with a position on page load
function initMap() {
  geocoder = new google.maps.Geocoder();

  //Initializing map on first run
  geocoder.geocode({'address': "2100 Whitman Ln Seattle"}, function(results, status) {
      if(status == 'OK') {
        console.log("Geocode successful: " + results[0].geometry.location);
        var center = results[0].geometry.location;
        homePlace = new Place(results[0]);
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 18,
          center: center
        });
        placeService = new google.maps.places.PlacesService(map);


        marker1 = new google.maps.Marker({
          position: center,
          map: map,
          label: {
            fontFamily: "Material Icons",
            text: "home",
            fontSize: '19px'
          },
        });
        marker1.setZIndex(100);
        marker1.setDraggable(true);
      } else {
        console.log("Error: geocode failed!");
      }

      marker1.addListener('click', function() {
          if(currPlace == homePlace) {
            pano = map.getStreetView();
            pano.setPosition(marker1.getPosition());
            pano.setPov(({
              heading: 0,
              pitch: 0
            }));
            pano.setVisible(true);
          } else {

            for (var i = 0; i < markerList.length; i++) {
              markerList[i].setAnimation(null);
            }

            //marker1.setAnimation(google.maps.Animation.BOUNCE);

            currPlace = homePlace;
            map.setCenter(marker1.getPosition());
          }
          $('#currPos').empty();
          $("#currPos").append("<h2 >" + homePlace.name + "</h2>");
      });


      marker1.addListener('dragend', function() {
        geocoder.geocode({'location': marker1.getPosition()}, function(revResults, revStatus) {
          if(revStatus == "OK") {
            console.log(revResults[0].formatted_address);
            var search = {
                location: revResults[0].geometry.location,
                radius: 100000,
                query: revResults[0].formatted_address,
                type: revResults[0].formatted_address
              };
            placeService.textSearch(search, function(results, status) {
              if(status == google.maps.places.PlacesServiceStatus.OK) {
                console.log(results);
                homePlace.setPlace(results[0]);

                $('#currPos').empty();
                $("#currPos").append("<h2 >" + homePlace.name + "</h2>");
              }
            });
          }
        });
      });

  });

  //When find addres is clicked, change marker and center position on map
  $("#find").click(function() {
      let newPosition = $("#address").val();

      geocoder.geocode({'address': newPosition}, function(results, status) {
          if(status == 'OK') {
            let loc = results[0].geometry.location;
            console.log("Geocode for " + address + " successful: " + loc);
            map.panTo(loc);
            marker1.setPosition(loc);
          } else {
            console.log("Geocode for " + address +" failed");
          }
      });
  });


  $("#scan").click(function() {
      temp = $("#radius").val();
      let filter = $('#filter').val();
      //Radius in Km
      var distance = parseFloat(temp) * 1000;
      console.log(distance);

      var search = {
          location: marker1.getPosition(),
          radius: distance,
          query: filter,
          type: filter
        };

        searcharea.setMap(map);
        searcharea.setRadius(distance);
        searcharea.setCenter(marker1.getPosition());
        searcharea.setVisible(true);

        placeService.textSearch(search, function(results, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            console.log(results);
            //Clear the div
            $('#search_results').empty();
            clearMarkers();
              for (var i = 0; i < results.length; i++) {
                var place = new Place(results[i]);
                console.log("Dist from Home to " + place.name + " is: " + calcDist(homePlace.location, place.location) + "m");
                if( $('#fixRad').is(':checked') && calcDist(homePlace.location, place.location) > distance) {
                  continue;
                }
                destinations.push(place);
                placeMarker(results[i].geometry.location, place);

              }

              //console.log(destinations[5].name);
            }
        });
  });


}

function clearMarkers() {
  for(var i = 0; i < markerList.length; i++) {
    markerList[i].setMap(null);
  }
  markerList.length = 0;
}

function placeMarker(position, place) {

  let marker = new google.maps.Marker({
    position: position,
    map: map,
  });

  marker.addListener('click', function() {
      if(currPlace == place) {
        pano = map.getStreetView();
        pano.setPosition(marker.getPosition());
        pano.setPov(({
          heading: 0,
          pitch: 0
        }));
        pano.setVisible(true);
      } else {

        for (var i = 0; i < markerList.length; i++) {
          markerList[i].setAnimation(null);
        }

        marker.setAnimation(google.maps.Animation.BOUNCE);
        //marker1.setAnimation(null);
        currPlace = place;
        map.panTo(marker.getPosition());
      }

      $('#currPos').empty();
      $("#currPos").append("<h2 >" + place.name + "</h2>");
  });

  markerList.push(marker);
}


function scanSetup(LatLng, radius) {
    var response = places + radius + "&location=" + (""+LatLng).replace("(", "").replace(")", "").replace(" ", "");
    console.log(response);
    return response;
}



function reverseGeocode(latlng) {


}



//$(document).ready(initMap);
