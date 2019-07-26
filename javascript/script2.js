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
