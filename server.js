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

function getGameByCode(games_result, game_name) {
    for (var i = 0; i < games_result.length; i++) {
      if (games_result[i]["game_code"] == game_name) {
          return games_result[i];
      }
    }

    return null;
}

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
            // Start Requested Game ...
            let game_name = chosen_game !== null ? chosen_game : null;
            var game_details = getGameByCode(games_result, chosen_game)
            if(game_details != null) {  // Confirm game exists, a non null valid = correct game
                gamedesc = game_details["description"];
                console.log("Game description is", gamedesc); 
		socket.join("game-" + game_name);
                callback({ status: "Success", message: "correct" }); // could send gamedesc back at this point?
            } else {
                callback({ status: "Error", message: "Invalid Game!" });
            };
        }); // join-a-game
    }); // on connection

    // Respond to socket adapter events - a player or a room

    // Create - start a new game room
    io.of("/").adapter.on("create-room", (room) => {
       if (room.startsWith("game-")) {
          console.log("new game:", room.replace("game-", "")); // NEW GAME ROOM STARTED
        } else {
          console.log("new player:", room); // NEW PLAYER STARTED
        }
    }); // create-room

    // Join a game room - Inform users within game of changes (i.e. count of active players)
    io.of("/").adapter.on("join-room", (room, id) => {
      if(room !== id) {
        db_connection.query(`INSERT INTO player(id, room_id) VALUES('${id}', '${room.replace("game-", "")}')`).catch(err => console.log(err));
        let room_size = io.sockets.adapter.rooms.get(room).size; // number of currently connected players to the game
        console.log(id, "joined", room, room_size, "online");
        io.to(room).emit("room-update", room.replace("game-", ""), room_size);
        let game_code = room.replace("game-", "");
        io.to(id).emit("game-join");
      }
    }); // join-room

    // Leave a game room - Inform users within game of changes (i.e. count of active players)
    io.of("/").adapter.on("leave-room", (room, id) => {
      if(room !== id) {
        let room_size = io.sockets.adapter.rooms.get(room).size;
        console.log(id, "left", room, room_size, "online");
        io.to(room).emit("room-update", room.replace("game-", ""), room_size);
        db_connection.query(`DELETE FROM player WHERE id = '${id}'`).catch(err => console.log(err));
      }
    }); // leave-room
}; // end of CONFIGURE_SOCKET

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
} // end of DELAY

// UPDATE GAME: Primary game management coding
async function update_game(room, io, db_connection, games_result) {
    if(!io.sockets.adapter.rooms.has(room)) {
       return; // error check in case there is no current game (room) in motion
    }
    if(!room.includes("game-")) {
	     return; // error check in case a player ID gets confused in here
    }
   let game_code = room.replace("game-", "");
   console.log("Playing game", game_code);

   // Check if the chosen game is a valid game in database // THIS REALLY NEEDS TO BE RUN BEFORE CREATING THE GAME ROOM ABOVE
   let game_details = getGameByCode(games_result, game_code)
   console.log(game_results);
   if (game_details == null) {
        return; // so this should exit back to main if the game doesn't exist?
   };

   let display_query = `
       SELECT pl.id, pl.room_id, pl.updated_at,
              wp.name, wp.radius, round(ST_DISTANCE(wp.location, pl.location) * 100000) as "distance"
       FROM player as pl, waypoint as wp
       WHERE wp.game_code = '${game_code}' AND pl.room_id = '${game_code}'
       ORDER BY pl.id
    `;
    let display_result = await db_connection.query(display_query);
    // io.to(room).emit('display-update', display_result.rows);
    io.to(room).emit('display-update', gamedesc, display_result.rows);

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
	var player = row.pl;
	if(distance != null) {
		if ( !within_radius.includes(row.name) && distance <= radius ) {
			within_radius.push(row.name);
			winning_player[i] = row.pl;
		}
	}
    }
    console.log(within_radius.length, "waypoints are currently occupied. By: ", winning_player);

    if (within_radius.length == minimum_player_count) {
    // if (within_radius.length == 1) { // for solo testing purposes
    	let reward = game_details["reward"]
    	io.to(room).emit('display-reward', reward);
	// TODO: Can this be emitted ONLY to a qualifying person not the whole room?
	// For (var p = 0; p < winning_player.length; p++) {
	//    io.to(winning_player[p]).emit(display-reward'); // ?
	// STOP GAME SCREEN UPDATES FOR THAT PLAYER!!! OR STOP GAME?
	// }
    } // Send reward
} // end of UPDATE_GAME

async function main() {
    // On SERVER Startup - Boot the database and delete all players left over from previous runs
    let connection = await boot_database(CONNECTION_STRING);
    let startingup = await connection.query("DELETE FROM player").catch(err => console.log(err));
    let games_result = await connection.query("SELECT game_code, description, reward, minimum_players FROM games").catch(err => console.log(err));
    await configure_socketio(connection, games_result.rows)
    console.log("System startup, clear all players");

    // Commence listening for client conenctions
    http.listen(PORT, () => console.log(`listening on *:${ PORT }`));
    while ( 1 == 1 ) {
      /* code to wait on goes here (sync or async) */
      Array.from( io.sockets.adapter.rooms.keys() ).forEach(roomId => { // For each concurrently running game
        update_game(roomId, io, connection, games_result);
      });

      // wait 10 seconds between performing game updates
      await delay(10000)
    }
} // end of MAIN

main();  // RUN IT ALL!
