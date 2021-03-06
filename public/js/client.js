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
var RtnError = null;
var geoOptions = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};
var spoof = false; //status for detection of locational spoofing activities
var spoofMsg = "Anti Gary mode enabled. \n This game is a physical location game, please ensure you are physically visiting the locations. If you believe this is a mistaken detection, please contact the game owner.";

for (var entry of urlParams) { 
    game = entry[0]; // only the first URL param is considered as the Game ID code
};   
if (game) { //if started with a URLParam then attempt to join that game ID
    game = game.toUpperCase();
    console.log("Client session called with parameter:", game);
    socket.emit('join-a-game', game, (response) => {         
        $("#game-error").text(response.message); // Set to display an error message underneath form entry field
     }); // emit join-a-game
} else { game = "GC" }; // set default form entry content for if no valid game parameter is provided

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
  if (acc==150) {spoof=true}; //devtools in client browser uses a fixed accuracy of 150m
  if (position.isFromMockProvider) {spoof=true}; //android option only .... except this doesn't work on FakeGPS?  ?
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
    socket.emit('LOGTX',`${socket.id} :-> Geolocation Error ${error.code}`); //clientlogdata should always be in the format of `${socket.id} :-> log message`
    socket.emit('LOGTX',`1=PERMISSION_DENIED; 2=POSITION_UNAVAILABLE; 3=TIMEOUT;`);
    switch (error.code) {
        case error.PERMISSION_DENIED:
            RtnError = "GeoLocation error: User denied the request for Geolocation. \n Please un-block location sharing for this webpage, and then refresh screen to restart.";
            window.alert(RtnError);
            window.open('https://enblesp1msgzhmk140wukq-on.drv.tw/ASMHUB/BrowserSettings.html', '_blank'); // popup in new tab/window
            location.href = "/";
            break;
        case error.POSITION_UNAVAILABLE:
            RtnError = "GeoLocation error: Location information is unavailable \n Please correct and then refresh screen to restart. \n\n If you opened the game from a Facebook messenger link, please re-open it from a full Internet browser app such as Chrome, Safari, Samsung, Firefox or Edge.";
            window.alert(RtnError);
            location.href = "/";
            break;
        case error.TIMEOUT:
            RtnError = "GeoLocation error: The request to get user location timed out. \n Please ensure you are not inside a concrete bunker, and then refresh screen to restart.";
            window.alert(RtnError);
            location.href = "/";
            break;
        default:
            RtnError = "GeoLocation error: An unknown error occurred. \n Please reboot your smartphone and restart.";
            window.alert(RtnError);
            location.href = "/";
            break;
    };
}; // GeoLocation Error handler

socket.io.on("reconnect", () => { // Reconnect if the client has dropped out for some reason but game was in progress
  if (is_joined) { 
      game = $("#gameId").val();
      console.log(`RECONNECTING CLIENT ${ game }`);
      socket.emit('LOGTX',`${socket.id} :-> Reconnecting Client to existing game`); //clientlogdata should always be in the format of `${socket.id} :-> log message`
      socket.emit('join-a-game', game, (response) => {
      $("#game-error").text(response.message); // Set to display an error message underneath form entry field
      }); // emit join-a-game again
  };
});

socket.on("game-join", () => {
   navigator.geolocation.getCurrentPosition(updatePosition, PosError, geoOptions); // First location update attempt, handle errors
   if (RtnError) {console.log("Geolocation Error Status", RtnError);
     socket.emit('LOGTX',`${socket.id} :-> Geolocation Error`); //clientlogdata should always be in the format of `${socket.id} :-> log message`
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
  console.log(new_player_count, "players are joined to", game_id, ":", gamedesc);  
  $("#current-game-player-count").text(new_player_count);
  $("#lj-in-game").show();
}); // end of ROOM-UPDATE

socket.on("display-update", (display_information) => {
  if (spoof) {
      console.log("Spoofing detected");
      socket.emit('LOGTX',`${socket.id} :-> Spoofing detected`); //clientlogdata should always be in the format of `${socket.id} :-> log message`
      window.alert(spoofMsg);
      location.href = "https://www.geocaching.com/help/index.php?pg=kb.chapter&id=141&pgid=46"
  };
  if (display_information[0].distance==null) { //don't do anything if the player's location hasn't been found yet
      socket.emit('LOGTX',`${socket.id} :-> Trying to display with null distances`); //clientlogdata should always be in the format of `${socket.id} :-> log message`
  } else { 
    MYID = socket.id; // this is current player
    displaytable=display_information; //used for updatemap in update position function 
    var DTStamp = new Date(display_information[0].updated_at).toLocaleTimeString('en-GB'); // Last Room update timestamp
    $("#gamedesc").text(game_description);

    // Display game status including any occupied status lines
    var $table = "<table border='1'> <caption>Current Player: " + MYID + " at " + DTStamp + "</caption>"
        $table += "<thead><tr class='table table-primary'><th>Player</th><th>Waypoint</th><th>Radius</th><th>Distance</th></tr></thead><tbody>"
    for (var i = 0; i < display_information.length; i++) {
      //if (display_information[i].distance != null) { // if it is null there is an error somewhere
          if (display_information[i].distance <= display_information[i].radius) {  // For display purposes only, not used for success determination here
              $table += "<tr class='table table-success'>"
          } else {
              $table += "<tr class='table table-light' border='1'>"
          };
          $table += "<td>" + display_information[i].id + "</td>"
          $table += "<td>" + display_information[i].name + "</td>"
          $table += "<td>" + display_information[i].radius + "m</td>"
          $table += "<td>" + display_information[i].distance.toLocaleString() + "m</td></tr>"
     };
    $table += "</tr></tbody></table>";
    $('#displayinfo').empty().append($table);
    localStorage.setItem('display_update', $table); //needed in reward.ejs
    //socket.emit('LOGTX',`${socket.id} :-> Displaying ${JSON.stringify(display_information)}`); //clientlogdata should always be in the format of `${socket.id} :-> log message`
    if (!map_started) {
         startupmap(latitude,longitude,display_information,MYID);
         map_started=true //startup the map, but just the first time we get here;    
    }
  }; //only if distance != null
}); // end of DISPLAY-UPDATE

socket.on("display-reward", (reward_information) => { //if all waypoints are in occupied state, show Success! ONLY SENT TO VALID PLAYERS
  if (!spoof) {
    localStorage.setItem('reward_information', reward_information); // Save Reward Info into Local Storage
    setTimeout( function() {
      location.href = "reward"; // Redirect user to reward page, disconnecting them from game and any session updates.
    }, 100);
  } else {console.log("Reward failed due to spoof attempt");
         socket.emit('LOGTX',`${socket.id} :-> Reward failed due to spoofing attempt`); //clientlogdata should always be in the format of `${socket.id} :-> log message`};
  }
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
     socket.emit('LOGTX',`${socket.id} :-> Form entry used= ${game}`); //clientlogdata should always be in the format of `${socket.id} :-> log message`
     game = game.trim();
     game = game.toUpperCase();
     $("#gameId").text(game);
     socket.emit('join-a-game', game, (response) => {
        $("#game-error").text(response.message); // Set to display any error message underneath form entry field
     }); // emit join-a-game
   }); // end of form
}, false); // end of GAME listener
