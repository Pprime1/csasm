const socket = io(); // or io("/"), the main namespace

function updatePosition(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;

  socket.emit('location-update', latitude, longitude);
}

let is_joined = false;

socket.io.on("reconnect", () => {
  if (is_joined) {
      socket.emit('join-a-group', $("#current-group-id").text())
  }
});

socket.on("room-join", () => {
  $("#lj-startup").hide();
  $("#lj-in-game").show();

  navigator.geolocation.getCurrentPosition(updatePosition);
// todo send current location and time to index.ejs    $("#current-location-and-time").text(updatePosition);
	const interval = setInterval(function() {
		navigator.geolocation.getCurrentPosition(updatePosition);
	}, 10000);
});

socket.on("room-update", (group_id, new_player_count) => {
  is_joined = true;

  $("#lj-startup").hide();
  $("#lj-in-game").show();

  $("#current-group-id").text(group_id);
  $("#current-group-member-count").text(new_player_count);
})

socket.on("room-location-update", (waypoint_information) => {
  console.log(waypoint_information);
  var result= JSON.stringify(waypoint_information);
  $("#wpinfo").text(result);
  //why is the result display NOT updating every 5s (room location update cycle) but the console is?
  	
  // TODO: Show all waypoints in a table:
  // List current player only per waypoint with their distance from each
  // IF the player is less than the radius distance from a waypoint, list all other players and their distances away from other waypoints
  // IF all waypoints have a player in their radius then room.reward is achieved
  
})

socket.on("room-reward", (reward_information) => {
  // do changes here!
  console.log(reward_information);

  // TODO: show reward on screen!

})

// Bind Submit Event for Front Page Group Joiner / Group Starter / Group Resume
window.addEventListener("load",function(event) {
  $( "#start-group-form" ).on( "submit", function(e) {
      e.preventDefault();

      console.log(`Attempting to start a group!`)

      socket.emit('join-a-group');
  });

  $( "#join-group-form" ).on( "submit", function(e) {
      e.preventDefault();

      var group = $("#groupId").val();
      console.log(`Attempting to join ${ group }`)

      socket.emit('join-a-group', group);
  });
}, false);
