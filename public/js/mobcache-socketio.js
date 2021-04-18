const socket = io(); // or io("/"), the main namespace

let current_group_id = personal_group_id

socket.on("group-join", (group_id, new_player_count) => {
  if(group_id !== current_group_id) {
    alert('Something went wrong!')
  }

  if(new_player_count > 1) {
    $("#lj-startup").hide();
    $("#lj-joining").show();
  }

  $("#current-group-id").text(current_group_id);
  $("#current-group-member-count").text(new_player_count);
})

// socket.on("group-leave", (group_id, player_count) => {
//   if(player_count > 1) {
//     $("#lj-startup").hide();
//     $("#lj-joining").show();
//   }
// });


// Join our personal group
socket.emit('join-our-group', current_group_id);


// Bind Submit Event for Front Page Group Joiner

window.addEventListener("load",function(event) {
  $( "#join-group-form" ).on( "submit", function(e) {
      e.preventDefault();

      var groupToJoin = $("#groupId").val();
      console.log(`Attempting to join ${ groupToJoin }`)

      if (personal_group_id === groupToJoin) {
        alert("You cannot join yourself!");
        return;
      }

      $("#lj-startup").hide();
      $("#lj-joining").show();

      current_group_id = groupToJoin;
      socket.emit('join-a-friend', groupToJoin);
  });
}, false);
