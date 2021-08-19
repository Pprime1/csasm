//Display a map centred on the current player's geolocation, with usual controls in place for zoom/pan etc. Update the map as the player moves
     //Display a marker showing the location of the current user
     //Display circles showing the waypoints and their target radius (not too opaque). Popup the name and coordinates of each waypoint on mouse click/hover/something.
     //TODO: Can we delay the first time this runs until after ten seconds or soemthing?

// *** Global variables out of client.js ***
    // latitude, longitude == geolocation of current player
    // displaytable == array per waypoint of: pl.id, pl.room_id, pl.updated_at, wp.name, wp.radius, wp.location, round(ST_DISTANCE(wp.location, pl.location) * 100000) as "distance"
var WPcircle=[]; // Store all game waypoints shown as map circles

function updatemap() {  // Update the current player location on map
   console.log("Update current player:",MYID,latitude,longitude)
   playerLoc.setLatLng(latitude, longitude); //update current player marker instead of creating new ones
   //--- TODO: display the player's direction of travel/facing? how? Not a feature it seems :-(

   // ZOOM: create an array of the objects and zoom the map to show them all?
   // var maparray = [];
   // maparray.push(L.marker(playerLoc));
   // var mapgroup = new L.featureGroup(maparray).addTo(mymap);
   // mapgroup.union(WPcircle.getBounds());
   // mymap.fitBounds(mapgroup.getBounds());
    
   //PAN: make the map pan to follow the player location?
   mymap.flyTo([latitude,longitude]); // pan the map to follow the player
   mymap.invalidateSize(); //reset map view
}; // end updatemap

//***SHOW MAP***
// FAIL - why doesn't the map tiles show in the window? Only showing top left until I manually pan the display?

// Define streetview and satellite layer views on the map
var streetmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: 'mapbox/streets-v11',
      maxZoom: 18,
      tileSize: 256,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoicHByaW1lMSIsImEiOiJja3JuNGRlenM3enRlMnRsM2s3NXl4cGRyIn0._X0tZf-JwyMdPCtZ8WHAMw' //public token
      // accessToken: 'pk.eyJ1IjoicHByaW1lMSIsImEiOiJja3JuNGdsNTYxcTR2MnB0amYzNnd1OHRhIn0.kcfA6jL1Be-qidECml4O4w' //my token
   }),
   satellite = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: 'mapbox/satellite-v9',
      maxZoom: 18,
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoicHByaW1lMSIsImEiOiJja3JuNGRlenM3enRlMnRsM2s3NXl4cGRyIn0._X0tZf-JwyMdPCtZ8WHAMw' //public token
      // accessToken: 'pk.eyJ1IjoicHByaW1lMSIsImEiOiJja3JuNGdsNTYxcTR2MnB0amYzNnd1OHRhIn0.kcfA6jL1Be-qidECml4O4w' //my token
   });
var baseMaps = {
     "Streetmap": streetmap,
     "Satellite": satellite
};

// Initial display of map centred on the current player (or coords -27,153 as the startup values?)
//var mymap = L.map('mapid', {
//	layers: [streetmap]
//}).setView([latitude, longitude],14);

//Simplify it by just using a single layer and reverting to no special tiles
var mymap = L.map('mapid').setView([latitude, longitude],14);
//L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: 'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
L.tileLayer('http://tiles.mapc.org/basemap/{z}/{x}/{y}.png', {
      attribution: 'Tiles by <a href="http://mapc.org">MAPC</a>, Data by <a href="http://mass.gov/mgis">MassGIS</a>',
      maxZoom: 17,
}).addTo(mymap);

// L.control.layers(baseMaps).addTo(mymap); //show choice of layer views
L.control.scale().addTo(mymap); //show scale bar

//mymap.invalidateSize(); //set map view
//setTimeout(mymap.invalidateSize.bind(mymap));

//Initialise things on the map
// Display the current player location 
console.log("Set current player:",MYID,latitude,longitude)
var playerLoc = L.marker([latitude,longitude]) //current player location - or more likely still just the initialising values?
    .addTo(mymap)
    .bindPopup("<b>Current Player</b><br>" + MYID + "<br>" +latitude + ", " + longitude);
    
//--- display each waypoint and target radius as a circle ... need to delay this until displaytable is set
if (displaytable != null) { // once populated display the circles
   for (var i = 0; i < displaytable.length; i++) { 
        console.log("Targetting:", displaytable[i].name, displaytable[i].location, displaytable[i].radius);
        //  WPcircle[i] = L.circle(displaytable[i].location, {  // location doesn't appear to be in a usable format here
        //      color: 'red',
        //      fillColor: '#f03',
        //      fillOpacity: 0.25,
        //      radius: displaytable[i].radius
        // }).addTo(mymap);
//FAIL - location is in weird format: location: "0101000020110F00003A0664AF77473BC037548CF3371F6340"

        //--- for each circle clicking on it will display the centre coordinates
        // WPcircle[i].bindPopup(displaytable[i].name + "<br>" + displaytable[i].location);
   }; //For each waypoint
} else {
    console.log("Target displaytable is null", displaytable)  // if not yet populated wait a bit and try again?
};


// I keep getting lost because map tiles aren't being displayed, click on map to see where you are 
// *** not needed in final release (although clicking on objects will popup some info)
var popup = L.popup();
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
}
mymap.on('click', onMapClick);



const interval = setInterval(function() {
          updatemap()
}, 5000); // update map every 5 seconds with current player location.
