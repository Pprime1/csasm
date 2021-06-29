const socket = io(); // or io("/"), the main namespace
$("#current-player-id").text(socket.id); // this is the current player 

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
 }

function updatePosition(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  var lat = ConvertDEGToDM(latitude,1);
  var lon = ConvertDEGToDM(longitude,0);
    $("#current-Lat").text(lat);
    $("#current-Lon").text(lon);
  socket.emit('location-update', latitude, longitude);
}

let is_joined = false;
socket.io.on("reconnect", () => { // Reconnect is not used any more?
  if (is_joined) {
      socket.emit('join-a-game', $("#current-game-id").text())
  }
});

socket.on("game-join", () => {
// socket.on("game-join", (gamedescription) => {
   $("#lj-startup").hide();
   $("#lj-reward").hide();
   $("#lj-in-game").show();
   // $("#game-description").text(gamedescription);
   navigator.geolocation.getCurrentPosition(updatePosition);
   const interval = setInterval(function() {
       navigator.geolocation.getCurrentPosition(updatePosition); // TODO: does this really keep running ? Or should this bit be in room-update isntead?
   }, 5000);
}); // end of GAME-JOIN

socket.on("room-update", (game_id, new_player_count) => {
  is_joined = true;
  $("#lj-startup").hide();
  $("#lj-in-game").show();
  $("#current-game-id").text(game_id);
  console.log("is_joined to ", game_id)
  $("#current-game-player-count").text(new_player_count);
}); // end of ROOM-UPDATE

socket.on("display-update", (display_information) => {
  console.log(display_information);
  var MYID = socket.id; // this is current player ... variable is now set at the top could be reused here too
  var DTStamp = new Date(display_information[0].updated_at).toLocaleTimeString('en-GB'); // Last Room update timestamp
	
  // Display in here the occupied status? Perhaps a different display class if distance<=radius?
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
}); // end of DISPLAY-UPDATE

socket.on("display-reward", (reward_information) => { // if all waypoints are in occupied state, show Success! ONLY SENT TO VALID PLAYERS
  $("#lj-startup").hide();
  $("#lj-in-game").show();
  $("#lj-reward").show();
  console.log(reward_information);
  $("#rewardinfo").text(reward_information);
  // TODO: is there a way to STOP THE GAME or prevent screen updates at this point for the relevant player?
}); // end of DISPLAY-REWARD

// Bind Submit Event for Front Page Game Joiner
window.addEventListener("load",function(event) {
  $( "#join-game-form" ).on( "submit", function(e) {
    e.preventDefault();
    var game = $("#gameId").val();
    game = game.toUpperCase();
    console.log(`Attempting to join ${ game }`)
    socket.emit('join-a-game', game);
  });
}, false); // end of JOIN-GAME-FORM
