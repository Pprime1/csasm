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

	const interval = setInterval(function() {
		navigator.geolocation.getCurrentPosition(updatePosition);
	}, 60000);
});

socket.on("room-update", (group_id, new_player_count) => {
  is_joined = true;

  $("#lj-startup").hide();
  $("#lj-in-game").show();

  $("#current-group-id").text(group_id);
  $("#current-group-member-count").text(new_player_count);
})

socket.on("room-location-update", (information) => {
  // do changes here!
  console.log(information);

})

// socket.on("group-leave", (group_id, player_count) => {
//   if(player_count > 1) {
//     $("#lj-startup").hide();
//     $("#lj-joining").show();
//   }
// });

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
