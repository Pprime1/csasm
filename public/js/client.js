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
  var lon = ConvertDEGToDM(longitude,0);
    $("#current-Lat").text(lat);
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

socket.on("room-display-update", (display_information) => {
  console.log(display_information);
  var MYID = socket.id // this is current player?
  
  var DTStamp = display_information[0].updated_at.format("yyyy-MM-dd HH:mm:ss");
	
 // var DTStamp = display_information[0].updated_at; //display_information[0].updated_at.toLocaleString(); // how to convert the timestamp to a readable format?
	
  var $table = "<table border='1'> <caption>Current Player: " + MYID + " at " + DTStamp.toLocaleTimeString() + "</caption>"
      $table += "<thead><tr><th>Player</th><th>Waypoint</th><th>Radius</th><th>Distance</th></tr></thead><tbody>"
  for (var i = 0; i < display_information.length; i++) {
         $table += '<tr><td>' + display_information[i].id + '</td>'
         $table += '<td>' + display_information[i].name + '</td>'
	 $table += '<td>' + display_information[i].radius + 'm</td>'
         $table += '<td>' + display_information[i].distance + 'm</td></tr>'
   }
   $table += "</tr></tbody></table>"
   $('#displayinfo').empty().append($table);
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
