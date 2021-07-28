//--- TODO - display a map centred on the current player's geolocation, with usual controls in place for zoom/pan etc. Update the map as the player moves
	//Display a marker showing the location of the current user
	//Display circles showing the waypoints and their target radius (not too opaque). Popup the name and coordinates of each waypoint on mouse click/hover/something.
     
     //--- Alternative: Use straight openstreetmap. Not really any better? no good at all actually
     //L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
     //   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	   //    maxZoom: 18,
     //    tileSize: 512,
     //    zoomOffset: -1,
     //}).addTo(map);
          
     //--- display the player's location (and direction?)
     //var playerLoc = L.marker([latitude,longitude]).addTo(mymap);
     
     //--- display each waypoint and target radius as a circle
     //var WPcircle[i] = L.circle([lat[i],lon[i]], {
     //    color: 'red',
     //   fillColor: '#f03',
     //    fillOpacity: 0.5,
     //    radius: radius[i]
     //}).addTo(mymap);
     
     //--- for each circle clicking on it will display the centre coordinates
     //circle[i].bindPopup(lat{i],lon[i]);
     
     
// *** ALSO:- This script has to be called AFTER the <div id="mapid"> in idex.ejs. So it cannot be in client.js where all the variables are set? How can I access all the variables here?

// If you made a global variable / global methods you could also make reference to the map from client.js

     var mymap = L.map('mapid').setView([latitude, longitude], 18);
     L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
         attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
         id: 'mapbox/streets-v11',
         tileSize: 512,
         zoomOffset: -1,
         accessToken: 'pk.eyJ1IjoicHByaW1lMSIsImEiOiJja3JuNGdsNTYxcTR2MnB0amYzNnd1OHRhIn0.kcfA6jL1Be-qidECml4O4w'
     }).addTo(mymap);
     
