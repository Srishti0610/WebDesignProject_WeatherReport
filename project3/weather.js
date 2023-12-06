let map;
let geocoder;
let marker;
let markers = [];
let latitude = 32.75;
let longitude = -97.13;

function initialize () {
   sendRequest();
}

function initMap() {
   geocoder = new google.maps.Geocoder();
   map = new google.maps.Map(document.getElementById("map"), {
     zoom: 8,
     center: { lat: latitude, lng: longitude },
   });

   marker = new google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map,
      title: "My Weather Pin",
    });

    map.addListener("click", (mapsMouseEvent) => {
      latitude = JSON.parse(JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2))["lat"];
      longitude = JSON.parse(JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2))["lng"];

      marker.setMap(null);
      marker = new google.maps.Marker({
         position: mapsMouseEvent.latLng,
         map,
         title: "My Weather Pin",
       });
       sendRequest ();
    });

 }

 function getWeather() {
   var address = document.getElementById('cityName').value;
   console.log(address);
   geocoder.geocode( { 'address': address}, function(results, status) {
     if (status == 'OK') {
       console.log(results[0].geometry.location);
       latitude = (JSON.parse(JSON.stringify(results[0].geometry.location.toJSON(), null, 2))["lat"]);
       longitude = (JSON.parse(JSON.stringify(results[0].geometry.location.toJSON(), null, 2))["lng"]);
       map.setCenter(results[0].geometry.location);
       marker = new google.maps.Marker({
           map: map,
           position: results[0].geometry.location
       });
       sendRequest();
     } else {
       alert('Geocode was not successful for the following reason: ' + status);
     }
   });
 }
 
window.initMap = initMap;

function sendRequest () {
   var xhr = new XMLHttpRequest();
   xhr.open("GET", "proxy.php?lat="+latitude+"&lon="+longitude);
   xhr.setRequestHeader("Accept","application/json");
   xhr.onreadystatechange = function () {
       if (this.readyState == 4) {
         var json = JSON.parse(this.responseText);
         var str = JSON.stringify(json,undefined,2);
         let weatherData = JSON.parse(str);
         weatherDataDisplay = "<h2>Weather Details</h2>"
         weatherDataDisplay+= "<p><strong>Location: </strong> <span>"+weatherData.name+"</span></p>"
         weatherDataDisplay+= "<p><strong>Description: </strong> <span>"+weatherData.weather[0].description+"</span></p>"
         weatherDataDisplay+= "<p><strong>Weather: </strong> <span>"+weatherData.weather[0].main+"</span></p>"
         weatherDataDisplay+= "<p><strong>Temperature </strong> <span></span> <span class='icon'>🌡️: "+weatherData.main.temp+" Kelvin </span></p>"
         weatherDataDisplay+= "<p><strong>Humidity </strong> <span></span> <span class='icon'>💧: "+weatherData.main.humidity+" % </span></p>"
         weatherDataDisplay+= "<p><strong>Wind </strong> <span></span> <span class='icon'>🌬️ : "+weatherData.wind.speed+" meter/sec </span></p>"
         document.getElementById("output").innerHTML = weatherDataDisplay;
       }
   };
   xhr.send(null);
}
