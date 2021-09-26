//***SHOW MAP*** Display a map centred on the current player's geolocation, with usual controls in place for zoom/pan etc. Update the map as the player moves ***//

// *** Global variables out of client.js ***
    // latitude, longitude == geolocation of current player
    // MYID == ID of current player
    // is_joined == boolean set true once the player is joined to a game
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
      // accessToken: 'pk.eyJ1IjoicHByaW1lMSIsImEiOiJja3JuNGRlenM3enRlMnRsM2s3NXl4cGRyIn0._X0tZf-JwyMdPCtZ8WHAMw' //public token
      accessToken: 'pk.eyJ1IjoicHByaW1lMSIsImEiOiJja3JuNGdsNTYxcTR2MnB0amYzNnd1OHRhIn0.kcfA6jL1Be-qidECml4O4w' //my token
   }),
   altOSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
   });
var baseMaps = {
     "Streetmap": streetmap,
     "Satellite": satellite,
     "altOSM": altOSM
};
var mymap = L.map('mapid', { // Define the map
    layers: [altOSM] //default layer
}).setView([-27.5,153],17); //start nearby in SEQ
L.control.layers(baseMaps).addTo(mymap); //show choice of layer views
L.control.scale().addTo(mymap); //show scale bar

var WPcircle=[]; // Store all game waypoints shown as map circles
var playerLoc = new L.marker([-27.5,153]).addTo(mymap); // set player location variable as a declared variable
var map_joined = false;


function updatemap() {  // Update the current player location on map
   console.log("Update current player:",MYID,latitude,longitude); //Update not re-create
   //playerLoc.setLatLng(latitude, longitude); //update current player marker instead of creating new ones
   playerLoc = L.marker(latitude, longitude).update(playerLoc);
	
   // ZOOM: create an array of the objects and zoom the map to show them all?
   // var maparray = [];
   // maparray.push(L.marker(playerLoc));
   // var mapgroup = new L.featureGroup(maparray).addTo(mymap);
   // mapgroup.union(WPcircle.getBounds());
   // mymap.fitBounds(mapgroup.getBounds());
    
   //PAN: make the map pan to follow the player location
   mymap.flyTo([latitude,longitude]); // pan the map to follow the player
   mymap.invalidateSize(); //reset map view
}; // end updatemap

function startmap() { // Initial display of map centred on the current player location
    console.log("Create current player marker:",is_joined,MYID,latitude,longitude); 
    playerLoc = L.marker(latitude, longitude).addTo(mymap);
	
    //--- display each waypoint and target radius as a circle ... need to delay this until displaytable is set
    colour='#0000ff' // Blue for default
    console.log("Circles data",displaytable,is_joined);
    for (var i = 0; i < displaytable.length; i++) { 
       if (displaytable[i].distance <= displaytable[i].radius) {colour='#00FF00'} else {colour='#ff0000'}; //green if occupied, otherwise red
       //   latlon=ST_AsText(displaytable[i].location);      //FAIL - location is in GEOM format: eg location: "0101000020110F00003A0664AF77473BC037548CF3371F6340" need to convert back to coords
          latlon= L.latlng(-27.2792, 152.975867); // for troubleshooting purposes
	    
          console.log("Target:", displaytable[i].name, displaytable[i].location, latlon, displaytable[i].radius, displaytable[i].distance, colour);
          WPcircle[i] = L.circleMarker(latlon, { 
             radius: displaytable[i].radius,
             color: colour,
             fillColor: colour,
             fillOpacity: 0.25
          }).addTo(mymap)
          .bindPopup(displaytable[i].name + "<br>" + displaytable[i].location);
     }; //For each waypoint 
	
    //Test a static circle
    //WPcircle[0] = new L.circleMarker([-27.2792, 152.975867], {
    //     radius: 150,
    //     color: colour,
    //     fillColor: colour,
    //     fillOpacity: 0.2
    //}).addTo(mymap);
    //WPcircle[0].bindPopup("HOME CIRCLE" + "<br>" + "location");

    map_joined=true;
}; //end startmap 


async function main() {
    const interval = setInterval(function() {
          mymap.invalidateSize(); //reset map view
          if (is_joined) { // we need to know that the game has started before updating the map
	     if (!map_joined) { startmap()}; //start the map only once 
	     updatemap();
	  }
    }, 5000); // update map every 5 seconds with current player location.
};
main();
