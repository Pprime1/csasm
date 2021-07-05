const socket = io(); // or io("/"), the main namespace

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
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  var lat = ConvertDEGToDM(latitude,1);
  var lon = ConvertDEGToDM(longitude,0);
    $("#current-Lat").text(lat);
    $("#current-Lon").text(lon);
  socket.emit('location-update', latitude, longitude);
}; // UpdatePosition

function PosError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            console.log("GeoLocation error: User denied the request for Geolocation.");
            return;
        case error.POSITION_UNAVAILABLE:
            console.log("GeoLocation error: Location information is unavailable.");
            return;
        case error.TIMEOUT:
            console.log("GeoLocation error: The request to get user location timed out.");
            return;
        default:
            console.log("GeoLocation error: An unknown error occurred.");
            return;
    };
}; // Position Error handler

let is_joined = false;
socket.io.on("reconnect", () => { // Reconnect is not used any more?
  if (is_joined) {
      socket.emit('join-a-game', $("#current-game-id").text())
  }
});

socket.on("game-join", () => {
   $("#lj-startup").hide();
   $("#lj-in-game").show();
   navigator.geolocation.getCurrentPosition(updatePosition, PosError); // First location update attempt, handle errors
   const interval = setInterval(function() {
       navigator.geolocation.getCurrentPosition(updatePosition); // update geolocation every 5 seconds (is updating every 11 seconds ... room-update does this
   }, 5000);
}); // end of GAME-JOIN

socket.on("room-update", (game_id, gamedesc, new_player_count) => {
  is_joined = true;
  $("#lj-startup").hide();
  $("#lj-in-game").show();
  $("#current-game-id").text(game_id);
  $("#game-description").text(gamedesc); // Current game-description ... still can't get this to display on the index.ejs screen
  console.log(new_player_count, "are joined to", game_id, ":", gamedesc);  
  $("#current-game-player-count").text(new_player_count);
}); // end of ROOM-UPDATE

// socket.on("display-update", (gamedesc, display_information) => {
socket.on("display-update", (display_information) => {
  // console.log(gamedesc, display_information);
  console.log(display_information);
  var MYID = socket.id; // this is current player
  var DTStamp = new Date(display_information[0].updated_at).toLocaleTimeString('en-GB'); // Last Room update timestamp
  // $("#game-description").text(gamedesc); // Current gamedescription ... can't get this to display on the index.ejs screen
  // console.log("Current #game-description (display_update):", $("#game-description"));

  // Display game status including any occupied status lines
  var $table = "<table border='1'> <caption>Current Player: " + MYID + " at " + DTStamp + "</caption>"
      $table += "<thead><tr class='table table-primary'><th>Player</th><th>Waypoint</th><th>Radius</th><th>Distance</th></tr></thead><tbody>"
  for (var i = 0; i < display_information.length; i++) {
      if (display_information[i].distance != null && display_information[i].distance <= display_information[i].radius) {  // For display purposes only, not used for success determination here
          $table += "<tr class='table table-success'>"
      } else {
          $table += "<tr class='table table-light'>"
      };
      $table += "<td>" + display_information[i].id + "</td>"
      $table += "<td>" + display_information[i].name + "</td>"
      $table += "<td>" + display_information[i].radius + "m</td>"
      $table += "<td>" + display_information[i].distance.toLocaleString() + "m</td></tr>"
      };
  $table += "</tr></tbody></table>";
  $('#displayinfo').empty().append($table);
  
  // localStorage.setItem('display-update', $table);
  
  //localStorage.setItem('display-update', $('#displayinfo'));
  //localStorage.setItem('current-game',  $("#current-game-id"));
  //localStorage.setItem('game-description', $("#game-description"));
  
}); // end of DISPLAY-UPDATE

socket.on("display-reward", (reward_information) => { // if all waypoints are in occupied state, show Success! ONLY SENT TO VALID PLAYERS
  // Save Reward in Local Storage
  localStorage.setItem('reward_information', reward_information);
  console.log(reward_information);
  // Redirect user to reward page, thus disconnecting them from game session.
  setTimeout( function() {
    location.href = "reward";
  }, 100)
}); // end of DISPLAY-REWARD

// Bind Submit Event for Front Page Game Joining form
window.addEventListener("load",function(event) {
  $( "#join-game-form" ).on( "submit", function(e) {
     e.preventDefault();
     var game = $("#gameId").val();
     game = game.toUpperCase();
     console.log(`Attempting to join ${ game }`)
     socket.emit('join-a-game', game, (response) => {
        console.log(response.status, response.message); // IF response.status!=error then socket is joined to a game room and the update_game founction kicks off
        $("#game-description").text(response.message); // Set current gamedescription for display - NOT WORKING outside of this event listener? Not being displayed :(
        // console.log("Current #game-description (in form):", $("#game-description")); it's in there, but won't display in index.ejs
        // localStorage.setItem('current-game', game);
        // localStorage.setItem('game-description', response.message);     
     }); // emit join-a-game
   }); // end of form
}, false); // end of JOIN-GAME listener
