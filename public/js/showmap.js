//--- TODO - display a map centred on the current player's geolocation, with usual controls in place for zoom/pan etc. Update the map as the player moves
	//Display a marker showing the location of the current user
	//Display circles showing the waypoints and their target radius (not too opaque). Popup the name and coordinates of each waypoint on mouse click/hover/something.

// FAIL - why doesn't the map tiles show in the window? Only showing top left until I pan the display?
     //--- Alternative: Use straight openstreetmap. Not really any better? no good at all actually
     //L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
     //   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	   //    maxZoom: 18,
     //    tileSize: 512,
     //    zoomOffset: -1,
     //}).addTo(map);
          
  
// FAIL - displaytable probably containing the data I want to display, but it's not populated in client.js quickly enough? I need to put this into some sort of loop perhaps?
 
// *** Global variables of note out of client.js ***
// latitude, longitude == of current player  **** NOT UPDATING. IS HARD SET TO THE PRE-USER-UPDATE VALUES OF -27,153 ****
// displaytable == array per waypoint of: waypoint name, location, radius and player id, game ID and distance from this wp.

function updatemap() {
   // Display the current player location 
   var playerLoc = L.marker([latitude,longitude]) //current player location
        .addTo(mymap)
        .bindPopup("<b>Current Player</b><br>" + MYID + Latitude + Longitude)
        .openPopup();
   console.log("Current Player",MYID,Latitude,Longitude)
   //--- display the player's direction of travel/facing? how? Not a feature it seems

   var WPcircle=[]
   //--- display each waypoint and target radius as a circle
   for (var i = 0; i < displaytable.length; i++) { 
        if (displaytable[i].distance != null) { // if it is null there is an error somewhere
	    console.log("Mapping", displaytable[i]);
            WPcircle[i] = L.circle(location[i], {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: radius[i]
            }).addTo(mymap);
    
	    //--- for each circle clicking on it will display the centre coordinates
            circle[i].bindPopup(name[i],location[i]);
	} else {
	    console.log("mapping table is null", displaytable)
	};
   };
    
   // create an array of objects and zoom the map to show them all?
   // var maparray = [];
   // maparray.push(L.marker(playerLoc));
   // var mapgroup = new L.featureGroup(maparray).addTo(mymap);
   // mapgroup.union(WPcircle.getBounds());
   // mymap.fitBounds(mapgroup.getBounds());
    
   //make the map pan to follow the player location?
   mymap.flyTo([latitude,longitude]); // pan the map to follow the player
}; // end updatemap



// Allow streetview and satellite view on the map
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
var mymap = L.map('mapid', {
	layers: [streetmap]
}).setView([latitude, longitude],13);

L.control.layers(baseMaps).addTo(mymap);
L.control.scale().addTo(mymap);

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
}, 10000); // update map every 10 seconds
