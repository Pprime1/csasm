//***SHOWMAP.js***//
//Display a map centred on the current player's geolocation, with usual controls in place for zoom/pan/layers etc. Update the map as the player moves ***//

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
    
// Define the map ... it will start displaying it at the default location which is in UQ somewhere before variables get populated
var mymap = L.map('mapid', { 
   center: [latitude,longitude],
   zoom: 17,
   layers: [streetmap] //default layer
}); 

var personicon = L.icon({
    iconUrl: '/js/personicon.png',
    iconSize: [20, 20]
    });
var playerLoc = new L.marker([latitude,longitude], {icon: personicon}) // set player location marker as a declared variable but don't put it on the map yet

var WPcircle=[]; // Store all game waypoints shown as map circles
var WPN=[]; //define an array of all unique waypoint names
var WPC=[]; //define an array of all unique waypoint colours
var WPX=[]; //define an array of all unique waypoint X latitude
var WPY=[]; //define an array of all unique waypoint Y longitude
var WPR=[]; //define an array of all unique waypoint radius
var colour='blue'; // Blue for default before data is populated
var map_started = false;

function updatemap() {  // Update the current player location on map
   	playerLoc.setLatLng([latitude,longitude]); //update current player marker instead of creating new ones
	//set colour yellow if occupied by anyone, green if occupied by this player, otherwise red 	
	for (var i=0; i<displaytable.length; i++) {  //check every line of the displaytable (multiple players mean each waypoint has more than one entry)
   		for (var n=0; n<WPN.length; n++) { 
			if (displaytable[i].name == WPN[n]) { // find matching WPN (waypoint name) and update it's WPC (colour) accordingly
				if (displaytable[i].distance <= displaytable[i].radius && displaytable[i].id == MYID) {WPC[n]='green'}; //set to green if player is in it
				if (displaytable[i].distance <= displaytable[i].radius && WPC[n] != 'green') {WPC[n]='yellow'}; //set to yellow if anyone is in it, and not already green
			};
		};
	}; 
	for (var n=0;n<WPN.length;n++) {
		WPcircle[n].setStyle({color: WPC[n], fillcolor: WPC[n]}); //set circle colour (circles are already on map, just updating colours here)
		console.log("Update Circle:",n, WPN[n], WPC[n]);	
		WPC[n] = 'red'; //reset every circle to red (unoccupied) until next updatemap
	};
	mymap.panTo([latitude,longitude]); // pan the map to follow the player (TODO: Can we toggle pan mode?)
}; // end updatemap

	
async function main() {
    const interval = setInterval(function() {
         if (is_running) { // we need to know that there is data populated before showing or updating the map with it
	     if (!map_started) {  //start the map only once 
		L.control.layers(baseMaps).addTo(mymap); //show choice of layer views
    		L.control.scale().addTo(mymap); //show scale bar
		console.log("Create current player marker:",MYID,latitude,longitude); 
    		playerLoc.setLatLng([latitude,longitude]).addTo(mymap).bindPopup(MYID); //update current player marker, and now show it on the map
		
		for (var i=0; i<displaytable.length; i++){ //for every line of the displaytable (multiple players mean each waypoint has more than one entry), 
			if (!WPN.includes(displaytable[i].name)) { // ... create a single circle entry per unique waypoint
	    	    	     WPN.push(displaytable[i].name);
	    	    	     WPC.push('red');
	    	    	     WPX.push(displaytable[i].x);
	    	    	     WPY.push(displaytable[i].y);
	    	    	     WPR.push(displaytable[i].radius);
			};
	     	};
	     	for (var n=0; n<WPN.length; n++){ 
			console.log("Target Circle:",n, WPN[n], WPX[n], WPY[n], WPR[n], WPC[n]); 
			WPcircle[n] = L.circle([WPX[n],WPY[n]], { // Create each circle once
    	    	    	     radius: WPR[n],
    	    	    	     fillOpacity: 0.2
			}).addTo(mymap)
	  	  	  .bindPopup(WPN[n] + "<br>" + WPX[n] + "," + WPY[n]);
	     	};	     
       	        map_started=true;
    	     }; //start the map only once
	     updatemap(); // for current player location and circle colour.
	  }; //update only if is_running
          mymap.invalidateSize(); //reset map view
    }, 5000); // update map every 5 seconds 
}; //end main
main();
