//***SHOWMAP.js***//
//Display a map centred on the current player's geolocation, with usual controls in place for zoom/pan etc. Update the map as the player moves ***//

//Global variables out of client.js
    // latitude, longitude == geolocation of current player
    // MYID == ID of current player
    // is_running == boolean set true once the player is joined to a game and main variables are first populated
    // displaytable == array per waypoint of: pl.id, pl.room_id, pl.updated_at, wp.name, wp.radius, wp.location, round(ST_DISTANCE(wp.location, pl.location) * 100000) as "distance"

// Define streetview and satellite layer views on the map
var streetmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: 'mapbox/streets-v11',
      // accessToken: 'pk.eyJ1IjoicHByaW1lMSIsImEiOiJja3JuNGRlenM3enRlMnRsM2s3NXl4cGRyIn0._X0tZf-JwyMdPCtZ8WHAMw' //public token
      accessToken: 'pk.eyJ1IjoicHByaW1lMSIsImEiOiJja3JuNGdsNTYxcTR2MnB0amYzNnd1OHRhIn0.kcfA6jL1Be-qidECml4O4w' //my token
   }),
   satellite = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: 'mapbox/satellite-v9',
      accessToken: 'pk.eyJ1IjoicHByaW1lMSIsImEiOiJja3JuNGdsNTYxcTR2MnB0amYzNnd1OHRhIn0.kcfA6jL1Be-qidECml4O4w' //my token
   });
var baseMaps = {
     "Streetmap": streetmap,
     "Satellite": satellite
};
var mymap = L.map('mapid', { // Define the map
    layers: [streetmap] //default layer
}).setView([latitude,longitude],17); //start in SEQ
    

var WPcircle=[]; // Store all game waypoints shown as map circles
var personicon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/Pprime1/csasm/Live-Map/personicon.png', //is this the best way to reference this image icon?
    iconSize: [20, 20]
    });
var playerLoc = new L.marker([latitude,longitude], {icon: personicon}) // set player location marker as a declared variable but don't put it on the map yet
      .bindPopup(MYID);
var colour='#0000ff' // Blue for default - if a circle is blue something is broken
var map_started = false;


function updatemap() {  // Update the current player location on map
   console.log("Update current player:",MYID,latitude,longitude); //Update not re-create
   playerLoc.setLatLng([latitude,longitude]); //update current player marker instead of creating new ones

   //display each waypoint and target radius as a circle ... change colour once occupied by current player
   for (var i = 0; i < displaytable.length; i++) { 
    if (displaytable[i].playerID == MYID) { // only display the circles once each and as applies to current player - displaytable lists a circle per player
      if (displaytable[i].distance <= displaytable[i].radius) {colour='#00FF00'} else {colour='#ff0000'}; //green if occupied, otherwise red
      //   latlon=ST_AsText(displaytable[i].location);      //FAIL - location is in GEOM format: eg location: "0101000020110F00003A0664AF77473BC037548CF3371F6340" need to convert back to coords
      latlon= "-27.2792,152.975867"; // for troubleshooting purposes  --- Also failed?
      console.log("Target Circle:",i, displaytable[i].name, displaytable[i].location, displaytable[i].radius, displaytable[i].distance, colour);
      WPcircle[i] = L.circle([latlon], { //This should be the displaytable.location[i] once that's in a useful format
   	 radius: displaytable[i].radius, //radius is in metres, but it is not displaying like that as the zoom level of map is changing it?
   	 color: colour,
   	 fillColor: colour,
   	 fillOpacity: 0.2
      }).addTo(mymap)
      .bindPopup(displaytable[i].name + "<br>" + displaytable[i].location);
    };
   }; //For each target circle
    
   //PAN: make the map pan to follow the player location
   mymap.panTo([latitude,longitude]); // pan the map to follow the player
   mymap.invalidateSize(); //reset map view
}; // end updatemap

async function main() {
    const interval = setInterval(function() {
         if (is_running) { // we need to know that there is data populated before showing or updating the map with it
	     if (!map_started) {  //start the map only once 
  	        mymap.invalidateSize(); //reset map view
    		L.control.layers(baseMaps).addTo(mymap); //show choice of layer views
    		L.control.scale().addTo(mymap); //show scale bar
		console.log("Create current player marker:",MYID,latitude,longitude); 
    		playerLoc.setLatLng([latitude,longitude]).addTo(mymap); //update current player marker, and now show it on the map
       		map_started=true;
    	     }; //start the map only once
	  updatemap(); 
	}
    }, 5000); // update map every 5 seconds with current player location.
};
main();
