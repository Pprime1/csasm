const socket = io(); // or io("/"), the main namespace

socket.on("room-join", () => {
  $("#lj-startup").hide();
  $("#lj-in-game").show();
});

socket.on("room-update", (group_id, new_player_count) => {
  $("#lj-startup").hide();
  $("#lj-in-game").show();

  $("#current-group-id").text(group_id);
  $("#current-group-member-count").text(new_player_count);
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
