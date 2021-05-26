const socket = io(); // or io("/"), the main namespace

function ConvertDEGToDM(deg, lat) {
    var absolute = Math.abs(deg);

    var degrees = Math.floor(absolute);
    var minutesNotTruncated = (absolute - degrees) * 60;
    var minutes = Math.floor(minutesNotTruncated);
    var seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2);
    if (lat) {
        var direction = deg >= 0 ? "N" : "S";
    } else {
        var direction = deg >= 0 ? "E" : "W";
    }
    return direction + degrees + "° " + minutes + "'";
}

function updatePosition(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  var lat = latitude;
  var lon = longitude;
    $("#current-Lat").text(ConvertDEGtoDM(lat,true)); //convert formatting
    $("#current-Lon").text(ConvertDEGtoDM(lon,false)); //convert formatting
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
  var result= JSON.stringify(waypoint_information,null,2);
  $("#wpinfo").text(result);

  // TODO: Show all waypoints in a table: pass variables from server.js?
	// TODO: Receive from server.js and pass to index.ejs?
        // pl.id WHERE id= '${socket.id}' // this is current player?
        // pl.location
        // pl.updated_at
        
	var wp = waypoint_information;
	
        $("#wpname").text(waypoint_information[0].name);
        $("#wpradius").text(waypoint_information[0].radius);
        $("#distance").text(waypoint_information[0].distance);

	
	// if distance <= wp.radius then set wp.occupied = true // reset to false every room refresh?
  // IF all waypoints have a wp.occupied = true then room-reward is achieved
  
})

socket.on("room-reward", (reward_information) => {
  // do changes here!
  console.log(reward_information);

  // TODO: show reward on seperate secured screen! And stop updates/refreshes of screen

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
