//***CLIENT.js***//
const socket = io(); // or io("/"), the main namespace
const urlParams = new URLSearchParams(location.search);
var latitude =-27;    // make available to global variable in Displaymap.js
var longitude =153;   // make available to global variable in Displaymap.js
var is_joined = false; // status for being part of a game
var is_running = false; // status for once all main variables are first populated
var displaytable =[]; // make available to global variable in Displaymap.js
var MYID = socket.id; // this is current player, make available to global variable in Displaymap.js
for (var entry of urlParams) { 
    var URLentry = entry[0]; // only the first URL paramis considered as the Game ID code
};   
var RtnError = null;
if (URLentry) {  // if started with a URLParam then attempt to join that game ID
    URLentry = URLentry.toUpperCase();
    console.log("URL Parameter:", URLentry);
    socket.emit('join-a-game', URLentry, (response) => {         
        $("#game-error").text(response.message); // Set to display an error message underneath form entry field
     }); // emit join-a-game
} else { URLentry = "GCTEST" }; // set a default to simplify testing. Revert this to } else { URLentry = "" }; once released

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

function updatePosition(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  var accuracy = position.coords.accuracy;
  var lat = ConvertDEGToDM(latitude,1);
  var lon = ConvertDEGToDM(longitude,0);
  var acc = Math.round(accuracy);
  $("#current-Lat").text(lat);
  $("#current-Lon").text(lon);
  $("#current-Acc").text(acc);
  localStorage.setItem('my_lat', lat);
  localStorage.setItem('my_lon', lon);
  localStorage.setItem('my_acc', accuracy);
  socket.emit('location-update', latitude, longitude);
}; // UpdatePosition

function PosError(error) { // handle/display get geolocation errors
    switch (error.code) {
        case error.PERMISSION_DENIED:
            RtnError = "GeoLocation error: User denied the request for Geolocation. \n Please allow location sharing and then refresh screen to restart";
            localStorage.setItem('RtnError', RtnError);
            window.alert(RtnError);
            // //not this one// window.open('https://docs.buddypunch.com/en/articles/919258-how-to-enable-location-services-for-chrome-safari-edge-and-android-ios-devices-gps-setting', '_blank');
            window.open('https://help.digiquatics.com/en/articles/648416-how-do-i-enable-location-services-on-my-mobile-tablet-device-or-browser', '_blank'); // popup in new tab/window
            location.href = "/";
            break;
        case error.POSITION_UNAVAILABLE:
            RtnError = "GeoLocation error: Location information is unavailable \n Please correct and then refresh screen to restart.";
            localStorage.setItem('RtnError', RtnError);
            window.alert(RtnError);
            location.href = "/";
            break;
        case error.TIMEOUT:
            RtnError = "GeoLocation error: The request to get user location timed out. \n Please refresh screen to restart";
            localStorage.setItem('RtnError', RtnError);
            window.alert(RtnError);
            location.href = "/";
            break;
        default:
            RtnError = "GeoLocation error: An unknown error occurred. \n Please correct and then refresh screen to restart";
            localStorage.setItem('RtnError', RtnError);
            window.alert(RtnError);
            location.href = "/";
            break;
    };
}; // GeoLocation Error handler

socket.io.on("reconnect", () => { // Reconnect is not used any more?
  if (is_joined) {
      socket.emit('join-a-game', $("#current-game-id").text());
  };
});

socket.on("game-join", () => {
   navigator.geolocation.getCurrentPosition(updatePosition, PosError, geoOptions); // First location update attempt, handle errors and set options
   console.log("Geolocation Error Status", RtnError);
   if (!RtnError) { 
       $("#lj-startup").hide();
       $("#lj-in-game").show();
       is_joined = true;
       const interval = setInterval(function() {
          navigator.geolocation.getCurrentPosition(updatePosition); // update geolocation every 5 seconds
       }, 5000);
   }; //set GeoLocation
}); // end of GAME-JOIN

socket.on("room-update", (game_id, gamedesc, new_player_count) => {
  is_joined = true;
  $("#lj-startup").hide();
  $("#current-game-id").text(game_id);
  if (gamedesc != 1) { // don't update if this was called by a room-leave command
    localStorage.setItem('game_description', gamedesc);
    localStorage.setItem('current_game', game_id);
  };
  console.log(new_player_count, "are joined to", game_id, ":", gamedesc);  
  $("#current-game-player-count").text(new_player_count);
  $("#lj-in-game").show();
}); // end of ROOM-UPDATE

socket.on("display-update", (display_information) => {
  displaytable=display_information; // make available to global variable in Displaymap.js
  //console.log(displaytable);
  MYID = socket.id; // this is current player
  var DTStamp = new Date(display_information[0].updated_at).toLocaleTimeString('en-GB'); // Last Room update timestamp
  var game_description = localStorage.getItem ('game_description');
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
  localStorage.setItem('display_update', $table);
  is_running = true;
}); // end of DISPLAY-UPDATE

socket.on("display-reward", (reward_information) => { // if all waypoints are in occupied state, show Success! ONLY SENT TO VALID PLAYERS
  // Save Reward in Local Storage
  localStorage.setItem('reward_information', reward_information);
  console.log("Reward=",reward_information);
  setTimeout( function() {
    location.href = "reward"; // Redirect user to reward page, disconnecting them from game session updates.
  }, 100)
}); // end of DISPLAY-REWARD

// Bind Submit Event for Front Page Game Joining form.
window.addEventListener("load",function(event) {
  document.querySelector("#gameId").value = URLentry;
  var GmError = localStorage.getItem('RtnError') || "Clear skies";
  $("#game-error").text(GmError); // Set to display any error message underneath form entry field
  if (!is_joined) { $("#lj-startup").show() }; // show the form only if not already joined to a game thanks to the URL paramater
  console.log("Starting Game Form");
  $( "#join-game-form" ).on( "submit", function(e) {
     e.preventDefault();
     var game = $("#gameId").val();
     game = game.toUpperCase();
     console.log(`Attempting to join ${ game }`)
     socket.emit('join-a-game', game, (response) => {
        $("#game-error").text(response.message); // Set to display any error message underneath form entry field
     }); // emit join-a-game
   }); // end of form
}, false); // end of JOIN-GAME listener
