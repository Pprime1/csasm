//***SERVER.js***//
const express = require('express');
const app = require('express')();
const http = require("http").createServer(app);
const io = require('socket.io')(http);
const path = require('path')
const randomstring = require ('randomstring');

// Our Database
const boot_database = require('./app/database').db;

// configuration
const PORT = process.env.PORT || 5000;
const CONNECTION_STRING = process.env.DATABASE_URL;

// Startup Logic
app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (request, response) => response.render('pages/index'))
  .get('/reward', (request, response)=> response.render('pages/reward'));

function getGameByCode(games_result, game_id) {
    for (var i = 0; i < games_result.length; i++) {
      if (games_result[i]["game_code"] == game_id) {
	  return games_result[i];
      };
    };
    console.log("Game is null");
    return null;
}; // end getGameByCode

// SOCKET FUNCTIONAL CODE
async function configure_socketio(db_connection, games_result) {
   io.on("connection", (socket) => {
        console.log(socket.id, "connected");
        socket.on('location-update', (...args) => {
           let location_update_query = `
              UPDATE player
              set location = ST_GeomFromText('POINT(${args[0]} ${args[1]})', 3857)
              WHERE id = '${socket.id}'
           `;
           db_connection.query(location_update_query).catch(err => console.log(err));
           console.log(socket.id, "performed location update", args);
        }); // location-update

        socket.on('join-a-game', (chosen_game, callback) => {
            // Start Chosen Game ...
            var game_details = getGameByCode(games_result, chosen_game);
            if(game_details != null) {  // Confirm game exists, a non null valid = successful game choice
                var gamedesc = game_details["description"];
                console.log("Chosen Game is", chosen_game, ":", gamedesc); 
		socket.join("game-" + chosen_game);
                callback({ status: "Success", message: gamedesc });
            } else {
		var game_error = "Invalid Game Code: " + chosen_game + " Please try again!"    
                callback({ status: "Error", message: game_error });  // Invalid game, leave form on screen with error message below
            };
        }); // join-a-game
    }); // on connection

    // Respond to SOCKET ADAPTER EVENTS - a player or a room
    // Create - start a new game room
    io.of("/").adapter.on("create-room", (room) => {
       if (room.startsWith("game-")) {
          console.log("new game:", room.replace("game-", "")); // NEW GAME ROOM STARTED
        } else {
          console.log("new player:", room); // NEW PLAYER STARTED
        };
    }); // create-room

    // Join a game room - Inform users within game of changes (i.e. count of active players)
    io.of("/").adapter.on("join-room", (room, id) => {
      if(room !== id) {
        db_connection.query(`INSERT INTO player(id, room_id) VALUES('${id}', '${room.replace("game-", "")}')`).catch(err => console.log(err));
        let room_size = io.sockets.adapter.rooms.get(room).size; // number of currently connected players to the game
        console.log(id, "joined", room, room_size, "online");
        var game_details = getGameByCode(games_result, room.replace("game-", ""));
	var gamedesc = game_details["description"];
	io.to(room).emit("room-update", room.replace("game-", ""), gamedesc, room_size);
        let game_code = room.replace("game-", "");
        io.to(id).emit("game-join");
      };
    }); // join-room

    // Leave a game room - Inform users within game of changes (i.e. count of active players)
    io.of("/").adapter.on("leave-room", (room, id) => {
      if(room !== id) {
        let room_size = io.sockets.adapter.rooms.get(room).size; // number of currently connected players to the game
        console.log(id, "left", room, room_size, "online");
        io.to(room).emit("room-update", room.replace("game-", ""), room_size);
        db_connection.query(`DELETE FROM player WHERE id = '${id}'`).catch(err => console.log(err));
      }
    }); // leave-room
}; // end of CONFIGURE_SOCKET

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}; // end of DELAY

// UPDATE GAME: Primary game management coding
async function update_game(room, io, db_connection, games_result) {
    if(!io.sockets.adapter.rooms.has(room)) {
       return; // error check in case there is no current game (room) in motion
    };
    if(!room.includes("game-")) {
	     return; // error check in case a player ID gets confused in here
    };
	
   let game_code = room.replace("game-", "");
   console.log("Playing game", game_code);
   let game_details = getGameByCode(games_result, game_code); // still needed here to populate the game_details variable again?

   //let WPLoc_query = `SELECT st_x(location), st_y(location) FROM waypoint`;
   //let WPLoc_result = await db_connection.query(WPLoc_query);
   //console.log("getting WPLoc",WPLoc_result);

   let display_query = `
       SELECT pl.id, pl.room_id, pl.updated_at,
              wp.name, wp.radius, wp.location, st_x(wp.location) as "x", st_y(wp.location) as "y", round(ST_DISTANCE(wp.location, pl.location) * 100000) as "distance"
       FROM player as pl, waypoint as wp
       WHERE wp.game_code = '${game_code}' AND pl.room_id = '${game_code}'
       ORDER BY pl.id
    `;
    let display_result = await db_connection.query(display_query);
    console.log("display_table",display_result.rows);
    io.to(room).emit('display-update', display_result.rows);

    // How many waypoints are there in this game?
    let minimum_player_count = game_details["minimum_players"]
    console.log(game_code, "requires", minimum_player_count, "waypoints to be occupied.");

    // Determine whether they have "met the criteria" to succeed in the game!
    var within_radius = [];
    var winning_player =[];
    for (var i = 0; i < display_result.rows.length; i++) {
	var row = display_result.rows[i];
	var distance = row.distance;
	var radius = row.radius;
	if(distance != null && distance <= radius ) { // error check, should never be null at this point
		console.log(row.id, "is occupying waypoint", row.name);
		winning_player.push(row.id);
		if ( !within_radius.includes(row.name) && distance <= radius ) { // only include a waypoint if not already occupied
			within_radius.push(row.name); 
		};
	};
    };
    console.log(within_radius.length, "waypoints are currently occupied.");

    if (within_radius.length == minimum_player_count) { // If the number of occupied waypoints == the number required we have success
    // if (within_radius.length == 1) { // for solo testing purposes
    	let reward = game_details["reward"];
	// Emit the reward ONLY to an occupying player, not the whole room
	for (var p = 0; p < winning_player.length; p++) {
	    io.to(winning_player[p]).emit('display-reward', reward);
	};
    }; // Send reward
}; // end of UPDATE_GAME

async function main() {
    // On SERVER Startup - Boot the database and delete all players left over from previous runs
    let connection = await boot_database(CONNECTION_STRING);
    let startingup = await connection.query("DELETE FROM player").catch(err => console.log(err));
    console.log("System startup");
    let games_result = await connection.query("SELECT game_code, description, reward, minimum_players FROM games").catch(err => console.log(err));
    await configure_socketio(connection, games_result.rows)
    // Commence listening for client connections
    http.listen(PORT, () => console.log(`listening on *:${ PORT }`));
	
    while ( 1 == 1 ) { // endless loop runs the games
      Array.from( io.sockets.adapter.rooms.keys() ).forEach(roomId => { // For each concurrently running game
         update_game(roomId, io, connection, games_result.rows);
      });
      await delay(10000); // wait 10 seconds between performing game updates
    }; // end of while loop
} // end of MAIN

main();  // RUN IT ALL!
