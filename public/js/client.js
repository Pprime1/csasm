//***CLIENT.js***//
const socket = io(); // or io("/"), the main namespace
const urlParams = new URLSearchParams(location.search);
var latitude =-27.5;    // defaults to UQ St Lucia
var longitude =153;   // defaults to UQ St Lucia
var is_joined = false; // status for being part of a game
var map_started = false; //set once the map has been started up
var game=null; //current game ID
var game_description = "Clear skies: choose a game to play";
var displaytable =[]; 
var MYID = socket.id; 
var RtnError="Clear Skies";

for (var entry of urlParams) { 
    game = entry[0]; // only the first URL param is considered as the Game ID code
};   
if (game) { //if started with a URLParam then attempt to join that game ID
    game = game.toUpperCase();
    console.log("Called with parameter:", game);
    socket.emit('join-a-game', game, (response) => {         
        $("#game-error").text(response.message); // Set to display an error message underneath form entry field
     }); // emit join-a-game
} else { game = "GC" }; // set default form entry content for if no valid game parameter is provided

var RtnError = null;
var geoOptions = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function ConvertDEGToDM(deg,dir) {
  var absolute = Math.abs(deg);
  var degrees = Math.floor(absolute);
  var minutesNotTruncated = (absolute - degrees) * 60;
  var minutes = Math.floor(minutesNotTruncated);
  var minutesdecimals = ((absolute - degrees) * 60).toFixed(3);
  var seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2);
  if (dir == 1) {
     	var direction = deg >= 0 ? "N" : "S";
  } else {
      	var direction = deg >= 0 ? "E" : "W";
  }
  return direction + degrees + "° " + minutesdecimals+ "' ";
 }; // Convert DM.MMM

function updatePosition(position) { //changes the player location details:
  latitude = position.coords.latitude; //main variables
  longitude = position.coords.longitude;
  var accuracy = position.coords.accuracy;
  var lat = ConvertDEGToDM(latitude,1); //change display format
  var lon = ConvertDEGToDM(longitude,0);
  var acc = Math.round(accuracy);
  $("#current-Lat").text(lat); //index.ejs for display above the table
  $("#current-Lon").text(lon);
  $("#current-Acc").text(acc);
  localStorage.setItem('my_lat', lat); //localstorage for ease of access in reward.ejs
  localStorage.setItem('my_lon', lon);
  localStorage.setItem('my_acc', accuracy);
  socket.emit('location-update', latitude, longitude); //server.js, which updates database for use in display-update later
  console.log("watchposition change", lat,lon);
  if (map_started) {updatemap(latitude,longitude,displaytable)}; //the map display - if the map has been created already
}; // UpdatePosition

function PosError(error) { // handle/display get geolocation errors
    switch (error.code) {
        case error.PERMISSION_DENIED:
            RtnError = "GeoLocation error: User denied the request for Geolocation. \n Please allow location sharing and then refresh screen to restart.";
            window.alert(RtnError);
            // //not this one// window.open('https://docs.buddypunch.com/en/articles/919258-how-to-enable-location-services-for-chrome-safari-edge-and-android-ios-devices-gps-setting', '_blank');
            window.open('https://help.digiquatics.com/en/articles/648416-how-do-i-enable-location-services-on-my-mobile-tablet-device-or-browser', '_blank'); // popup in new tab/window
            location.href = "/";
            break;
        case error.POSITION_UNAVAILABLE:
            RtnError = "GeoLocation error: Location information is unavailable \n Please correct and then refresh screen to restart. \n\n If you opened the game from a Facebook messenger link, please re-open it from a full Internet browser app such as Chrome, Safari, Samsung, Firefox or Edge.";
            window.alert(RtnError);
            location.href = "/";
            break;
        case error.TIMEOUT:
            RtnError = "GeoLocation error: The request to get user location timed out. \n Please refresh screen to restart.";
            window.alert(RtnError);
            location.href = "/";
            break;
        default:
            RtnError = "GeoLocation error: An unknown error occurred. \n Please correct and then refresh screen to restart.";
            window.alert(RtnError);
            location.href = "/";
            break;
    };
}; // GeoLocation Error handler

socket.io.on("reconnect", () => { // Reconnect if the client has dropped out for some reason but game was in progress
  if (is_joined) { 
      game = $("#current-gameId").val();
      console.log(`RECONNECTING CLIENT ${ game }`);
      socket.emit('join-a-game', game, (response) => {
      $("#game-error").text(response.message); // Set to display an error message underneath form entry field
      }); // emit join-a-game again
  };
});

socket.on("game-join", () => {
   navigator.geolocation.getCurrentPosition(updatePosition, PosError, geoOptions); // First location update attempt, handle errors
   if (RtnError) {console.log("Geolocation Error Status", RtnError)
   } else { 
       $("#lj-startup").hide();
       $("#lj-in-game").show();
       is_joined = true; 
       navigator.geolocation.watchPosition(updatePosition, PosError, geoOptions); //keep updating geolocation when it changes, rather than on a loop
   }; //Get and set Player GeoLocation, and keep watch on it moving
}); // end of GAME-JOIN

socket.on("room-update", (game_id, gamedesc, new_player_count) => {
  is_joined = true;
  $("#lj-startup").hide();
  $("#current-gameId").text(game_id);
  if (gamedesc != 1) { // don't update if this was called by a room-leave command
    localStorage.setItem('game_description', gamedesc); //?
    localStorage.setItem('current_game', game_id); //?
    game_description = gamedesc;
  };
  console.log(new_player_count, "are joined to", game_id, ":", gamedesc);  
  $("#current-game-player-count").text(new_player_count);
  $("#lj-in-game").show();
}); // end of ROOM-UPDATE

socket.on("display-update", (display_information) => {
  displaytable=display_information;
  MYID = socket.id; // this is current player
  var DTStamp = new Date(display_information[0].updated_at).toLocaleTimeString('en-GB'); // Last Room update timestamp
  $("#gamedesc").text(game_description);

  // Display game status including any occupied status lines
  var $table = "<table border='1'> <caption>Current Player: " + MYID + " at " + DTStamp + "</caption>"
      $table += "<thead><tr class='table table-primary'><th>Player</th><th>Waypoint</th><th>Radius</th><th>Distance</th></tr></thead><tbody>"
  for (var i = 0; i < display_information.length; i++) {
      if (display_information[i].distance != null) { // if it is null there is an error somewhere
          if (display_information[i].distance <= display_information[i].radius) {  // For display purposes only, not used for success determination here
              $table += "<tr class='table table-success'>"
          } else {
              $table += "<tr class='table table-light' border='1'>"
          };
          $table += "<td>" + display_information[i].id + "</td>"
          $table += "<td>" + display_information[i].name + "</td>"
          $table += "<td>" + display_information[i].radius + "m</td>"
          $table += "<td>" + display_information[i].distance.toLocaleString() + "m</td></tr>"
     } else { 
          console.log("distance is null error occurred", display_information)
     };
  };
  $table += "</tr></tbody></table>";
  $('#displayinfo').empty().append($table);
  localStorage.setItem('display_update', $table); //needed in reward.ejs
  if (!map_started) {startupmap(latitude,longitude,displaytable,MYID);
       map_started=true}; //startup the map, but just the first time we get here;    
}); // end of DISPLAY-UPDATE

socket.on("display-reward", (reward_information) => { //if all waypoints are in occupied state, show Success! ONLY SENT TO VALID PLAYERS
  localStorage.setItem('reward_information', reward_information); // Save Reward Info into Local Storage
  console.log("Sending Reward:",reward_information);
  setTimeout( function() {
    location.href = "reward"; // Redirect user to reward page, disconnecting them from game and any session updates.
  }, 100)
}); // end of DISPLAY-REWARD

// Bind Submit Event for Start Page Game-Joining form.
window.addEventListener("load",function(event) {
  document.querySelector("#gameId").value = game;
  $("#game-error").text(RtnError); //Set to display any error message underneath form entry field
  if (game=="GC") {console.log("No valid game-code supplied, Starting Game Form");}
  if (!is_joined) {$("#lj-startup").show() }; //show the form only if not already joined to a game
      
  $( "#join-game-form" ).on( "submit", function(e) {
     e.preventDefault();
     var game = $("#gameId").val();
     game = game.trim();
     game = game.toUpperCase();
     console.log(`Attempting to join ${ game }`)
     $("#gameId").text(game);
     socket.emit('join-a-game', game, (response) => {
        $("#game-error").text(response.message); // Set to display any error message underneath form entry field
     }); // emit join-a-game
   }); // end of form
}, false); // end of GAME listener
