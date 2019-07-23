 /*      DECLARING GLOBALS       */
var map;
var geocoder;
var marker1;
var curpos;

var temp = 0;

let api_key = "AIzaSyAtJor4eSuw3Wt8fLLYCfRrdK_AvAaQxHs";


var placeService;

let places = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=" + api_key + "&radius=";

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
  geocoder.geocode({'address': "2100 Whitman Ln"}, function(results, status) {
      if(status == 'OK') {
        console.log("Geocode successful: " + results[0].geometry.location);
        var center = results[0].geometry.location;
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 18,
          center: center
        });
        placeService = new google.maps.places.PlacesService(map);
        marker1 = new google.maps.Marker({
          position: center,
          map: map
        });

      } else {
        console.log("Error: geocode failed!");
      }
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
      var distance = parseInt(temp) * 1000;
      console.log(distance);
      // $.ajax({
      //     url: scanSetup(marker1.getPosition(), distance),
      //     type: 'GET',
      //     dataType: 'jsonp',
      //     success: function(response) {
      //       let json = response;
      //       console.log(json['results'][0]);
      //     }
      // });
      var search = {
          location: marker1.getPosition(),
          radius: ""+distance,
          query: filter
        };

        placeService.textSearch(search, function(results, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            console.log(results);
            //Clear the div
            $('#search_results').empty();
              for (var i = 0; i < results.length; i++) {
                var place = results[i];
                //createMarker(results[i]);
                $('#search_results').append("<p>" + results[i].formatted_address + "</p>");
              }
            }
        });
  });


}



function scanSetup(LatLng, radius) {
    var response = places + radius + "&location=" + (""+LatLng).replace("(", "").replace(")", "").replace(" ", "");
    console.log(response);
    return response;
}






//$(document).ready(initMap);
