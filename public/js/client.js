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
 }

function updatePosition(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  var lat = ConvertDEGToDM(latitude,1);
  var lon = ConvertDEGToDM(longitude,0); //why can't I run this?
    $("#current-Lat").text(lat); // should be lat/lon as formatted. sigh
    $("#current-Lon").text(lon);
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
        
	//$("#wpname").text(waypoint_information[0].name);
        //$("#wpradius").text(waypoint_information[0].radius);
       // $("#distance").text(waypoint_information[0].distance);
})

socket.on("room-display-update", (display_information) => {
  console.log(display_information);
  
  var DTStamp = display_information[0].updated_at.toLocaleString();
  var $table = "<table border='1'> <caption>Current Player: " + display_information[0].id + " at " + DTStamp + "</caption>"
      $table += "<thead><tr><th>Player</th><th>Waypoint</th><th>Radius</th><th>Distance</th></tr></thead><tbody><tr>"
  for (var i = 0; i < display_information.length; i++) {
         $table += '<td>' + display_information[i].player_id + '</td>'
         $table += '<td>' + display_information[i].name + 'm</td>'
	 $table += '<td>' + display_information[i].radius + 'm</td>'
         $table += '<td>' + display_information[i].distance + '>m</td>'
   }
   $table += "</tr></tbody></table>"
   $('#displayinfo').empty().append($table);
	
  // var displayresult= JSON.stringify(displayinfo,null,2);
  // $("#displayinfo").text(displayinfo);
})

  // if distance <= wp.radius then set wp.occupied = true // reset to false every room refresh?
  // IF all waypoints have a wp.occupied = true then room-reward is achieved

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

