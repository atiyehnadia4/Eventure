// main.html JAVASCRIPT
function myFunction(x){
  x.classList.toggle("change");
}

function openNav (){
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";

}

function closeNav (){
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";

}
//https://www.eventbriteapi.com/v3/events/search?location.address=vancovuer&location.within=10km&expand=venue
//-H 'Authorization: Bearer PERSONAL_OAUTH_TOKEN'
// user.html JAVASCRIPT
function eBrite(city, radius) {
  $.get('/api?address=' + city + '&radius=' + radius + "", function(response) {
    let json = JSON.parse(response);
    console.log(json);
    $("#results").append("<ul id='list'>")
    for (var idx in json.events) {
      if (json.events.hasOwnProperty(idx)) {
        let temp = json.events[idx];

        let latlng = {
          'lat': parseFloat(temp.venue.latitude),
          'lng': parseFloat(temp.venue.longitude)
        };

        $("#results").append("<li><a href='" + temp.url + "' target='blank'>" + temp.name.text + "</a></li>");
        //$("#results").append("<br>");

        //placeMarker(latlng, temp);
      }
      $("#results").append("</ul>")
    }
  });
}
