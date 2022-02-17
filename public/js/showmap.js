//***SHOWMAP.js***//
//***Display a map centred on the current player's geolocation, with usual controls in place for zoom/pan/layers etc. Update the map as the player moves ***//

// Define streetview and satellite layer views on the map
var streetmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: 'mapbox/streets-v11',
      maxZoom: 20,
      // accessToken: 'pk.eyJ1IjoicHByaW1lMSIsImEiOiJja3JuNGRlenM3enRlMnRsM2s3NXl4cGRyIn0._X0tZf-JwyMdPCtZ8WHAMw' //public token
      accessToken: 'pk.eyJ1IjoicHByaW1lMSIsImEiOiJja3JuNGdsNTYxcTR2MnB0amYzNnd1OHRhIn0.kcfA6jL1Be-qidECml4O4w' //my token
   }),
   satellite = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: 'mapbox/satellite-v9',
      maxZoom: 20,
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
var WPX=[]; //define an array of all unique waypoint x latitude
var WPY=[]; //define an array of all unique waypoint y longitude
var WPR=[]; //define an array of all unique waypoint radius
var currentAutoMove = false; // needed to check in `movestart` and 'touchmove' event-listeners if moved by user, or programmatically
var pauseAutoMove = false; // if true -> Stops moving map to auto follow the player location

var panbtn = L.easyButton({
  states: [{
    stateName: 'pauseAutoMove',      
    icon:      'fa-sign-in fa-lg',               
    title:     'Centre display at current Player', //Tooltip
    onClick: function(btn, map) { //if you click the button whilst it is in pauseAutoMove, recentre map and unpause
      currentAutoMove = true; //Set flag, that currently map is being moved to recentre
      mymap.panTo([latitude,longitude]); 
      currentAutoMove = false; //Remove flag again    
      pauseAutoMove = false; //set flag to stop Auto moving map 
      panbtn.state('AutoMove');                               
    }
  },{
    stateName: 'AutoMove', //clicking the button once it is doing AutoMove does nothing
    icon:      'fa-crosshairs fa-lg',
  }]
}).addTo(mymap);

mymap.on("zoomstart", function (e) { currentAutoMove = true }); //Set flag, that currently map is moved by a zoom command
mymap.on("zoomend", function (e) { currentAutoMove = false }); //Remove flag again
mymap.on('movestart',(e)=>{ //Check if map is being moved
    if(!currentAutoMove){ //ignore if it was a natural PlayerLoc or programmatic update
	pauseAutoMove = true; //set flag to stop Auto moving map 
	panbtn.state('pauseAutoMove'); //change button style to remove crosshairs and have a arrow-in icon
    }
});

function updatemap(latitude,longitude,displaytable) {  // Update the current player location on map	
   socket.emit('LOGTX',`${socket.id} :-> Mapping ${JSON.stringify(displaytable)}`); //clientlogdata should always be in the format of `${socket.id} :-> log message`
   playerLoc.setLatLng([latitude,longitude]); //update current player marker instead of creating new ones
   //set circle colour yellow if occupied by anyone, green if occupied by this player, otherwise red 	
   for (var i=0; i<displaytable.length; i++) {  //check every line of the displaytable (multiple players mean each waypoint has more than one entry)
   	for (var n=0; n<WPN.length; n++) { 
   	   if (displaytable[i].name == WPN[n]) { // find matching WPN (waypoint name) and update it's WPC (colour) accordingly
		if (displaytable[i].distance != null && displaytable[i].distance <= displaytable[i].radius && displaytable[i].id == MYID) {
			WPC[n]='green';
			console.log("Circle in play by me:",n, WPN[n], WPC[n]);	
			socket.emit('LOGTX',`${socket.id} :-> ${WPN[n]} occupying at distance ${displaytable[i].distance}m`); //clientlogdata should always be in the format of `${socket.id} :-> log message`
		}; //set to green if player is in it
		if (displaytable[i].distance != null && displaytable[i].distance <= displaytable[i].radius && WPC[n] != 'green') {
			WPC[n]='yellow'
			console.log("Circle in play by someone else:",n, WPN[n], WPC[n]);
		}; //set to yellow if anyone is in it, and not already green
	   };
	};
   }; 
   for (var n=0;n<WPcircle.length;n++) { //set and display circle colour (circles are already on map, just updating colours here)
	WPcircle[n].setStyle({color: WPC[n], fillcolor: WPC[n]}); 
	WPC[n] = 'red'; //reset every circle expectation colour back to red (unoccupied) until next updatemap
   };
   if(!pauseAutoMove){ //pan the map to follow the player unless it is on pause
   	currentAutoMove = true; //Set flag, that currently map is moved by a normal PlayerLoc Auto update
   	mymap.panTo([latitude,longitude]); 
   	currentAutoMove = false; //Remove flag again
   };
   mymap.invalidateSize(); //reset map view
}; // end updatemap

function startupmap(latitude,longitude,displaytable,MYID) {  // Create the initial map display
   L.control.layers(baseMaps).addTo(mymap); //show choice of layer views
   L.control.scale().addTo(mymap); //show scale bar
   
   playerLoc.setLatLng([latitude,longitude]).addTo(mymap).bindPopup(MYID + "<br/><a href='#' class='toplink'>Go Top</a>"); //update current player marker, and now show it on the map	
   mymap.on('popupopen', function() { // create a way to jump to top of page from within the map 
     $('.toplink').click(function() { // - especially useful if the map has been zoomed to commandeer the entire phone window view that prevents access outside the map otherwise
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0 });
   });		
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
     WPcircle[n] = L.circle([WPX[n],WPY[n]], { // Create each circle once
        radius: WPR[n],
        fillOpacity: 0.2
	     //colour is blue until Updatemap first runs
     }).addTo(mymap)
       .bindPopup(WPN[n] + "<br>" + WPX[n] + "," + WPY[n]);
   };	     
   panbtn.state('AutoMove');
   socket.emit('LOGTX',`${socket.id} :-> Start Mapping`); //clientlogdata should always be in the format of `${socket.id} :-> log message`
   updatemap(latitude,longitude,displaytable); //update the map to get it started
} //end startupmap
