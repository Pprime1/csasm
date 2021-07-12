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
    localStorage.setItem('my_lat', lat);
    localStorage.setItem('my_lon', lon);
  socket.emit('location-update', latitude, longitude);
}; // UpdatePosition

function PosError(error) { // display geolocation error to console. TODO:Can we do a screen popup as well?
    switch (error.code) {
        case error.PERMISSION_DENIED:
            // window.alert("sometext");
            window.alert("GeoLocation error: User denied the request for Geolocation.");
            console.log("GeoLocation error: User denied the request for Geolocation.");
            return;
        case error.POSITION_UNAVAILABLE:
            window.alert("GeoLocation error: Location information is unavailable.");
            console.log("GeoLocation error: Location information is unavailable.");
            return;
        case error.TIMEOUT:
            window.alert("GeoLocation error: The request to get user location timed out.");
            console.log("GeoLocation error: The request to get user location timed out.");
            return;
        default:
            window.alert("GeoLocation error: An unknown error occurred.");
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
       navigator.geolocation.getCurrentPosition(updatePosition); // update geolocation every 5 seconds
   }, 5000);
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
  $("#current-game-player-count").text(new_player_count); // this displays fine
  $("#lj-in-game").show();
}); // end of ROOM-UPDATE

socket.on("display-update", (display_information) => {
  console.log(display_information);
  var MYID = socket.id; // this is current player
  var DTStamp = new Date(display_information[0].updated_at).toLocaleTimeString('en-GB'); // Last Room update timestamp
  var game_description = localStorage.getItem ('game_description');
  $("#gamedesc").text(game_description);

  // Display game status including any occupied status lines
  var $table = "<table border='1'> <caption>Current Player: " + MYID + " at " + DTStamp + "</caption>"
      $table += "<thead><tr class='table table-primary'><th>Player</th><th>Waypoint</th><th>Radius</th><th>Distance</th></tr></thead><tbody>"
  for (var i = 0; i < display_information.length; i++) {
      if (display_information[i].distance != null && display_information[i].distance <= display_information[i].radius) {  // For display purposes only, not used for success determination here
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
  localStorage.setItem('display_update', $table);
  //console.log("T=",$table);
}); // end of DISPLAY-UPDATE

socket.on("display-reward", (reward_information) => { // if all waypoints are in occupied state, show Success! ONLY SENT TO VALID PLAYERS
  // Save Reward in Local Storage
  localStorage.setItem('reward_information', reward_information);
  console.log("Reward=",reward_information);
  setTimeout( function() {
    location.href = "reward"; // Redirect user to reward page, thus disconnecting them from game session updates.
  }, 100)
}); // end of DISPLAY-REWARD

// Bind Submit Event for Front Page Game Joining form.  TODO: Can we skip the first form entry if a parameter is included to the URL?
window.addEventListener("load",function(event) {
  $( "#join-game-form" ).on( "submit", function(e) {
     e.preventDefault();
     var game = $("#gameId").val();
     game = game.toUpperCase();
     console.log(`Attempting to join ${ game }`)
     socket.emit('join-a-game', game, (response) => {
        console.log(response.status, response.message); // IF response.status!=error then socket is joined to a game room and the update_game function kicks off
        $("#game-error").text(response.message); // Set to display an error message underneath form entry field
     }); // emit join-a-game
   }); // end of form
}, false); // end of JOIN-GAME listener
