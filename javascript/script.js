 /*      DECLARING GLOBALS       */
var map;
var geocoder;
var marker1;


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

        marker1 = new google.maps.Marker({
          position: center,
          map: map
        });

      } else {
        console.log("Error: geocode failed!");
      }
  });


  $("#find").click(function() {
      let newPosition = $("#address").val();
      var newLatLng;

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


}



//The process of turning an address into a Lat, lng notatino
function reverseGeocode(address) {

}






//$(document).ready(initMap);
