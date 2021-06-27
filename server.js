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
  .get('/', (request, response) => response.render('pages/index'));


// FUNCTION CODE
async function configure_socketio(db_connection) {
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
    
        socket.on('join-a-game', (...args) => {
           // Start Requested Game ... if game name is not supplied return error?
           let room_id = args.length > 0 ? args[0] : "GCTEST"; // this is to be replaced/removed
           socket.join("game-" + room_id);
        }); // join-a-game
    }); // on connection

    // Start up a room
    io.of("/").adapter.on("create-room", (room) => {
       if (room.startsWith("game-")) {
          console.log("new game-", room.replace("game-", ""));
	  //console.log("Scheduling Update Handler", room);  // commented out by Andrew
          //setInterval(roomUpdateHandler, 5000, room, io, connection);  // commented out by Andrew
          
	  // can we also send the game description to be displayed top of screen?
	  // let gamedescription = game_details(room.replace("game-", ""), db_connection);
	  // io.to(room).emit("room-join", gamedescription); // Inform client joining that they have joined a room, update display to show game status
        
        } else {
          console.log("new player-", room);
        }
    }); // create-room
    
    // Join or Leave - Inform users within game of changes (i.e. count of active players)
    io.of("/").adapter.on("join-room", (room, id) => {
      if(room !== id) {
        db_connection.query(`INSERT INTO player(id, room_id) VALUES('${id}', '${room.replace("game-", "")}')`).catch(err => console.log(err));
        let room_size = io.sockets.adapter.rooms.get(room).size; // number of currently connected players to the game
        console.log(id, "joined", room, room_size, "online");
        io.to(room).emit("room-update", room.replace("game-", ""), room_size);
        io.to(id).emit("room-join");
      }
    }); // join-room
    
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

async function game_details(room, db_connection) {
    let game_query = `SELECT description as gamedescription FROM games WHERE game_code = room.replace("game-", "")`;
    // let game_query_result = db_connection.query(game_query);
    // console.log("Description is", game_query_result);
    // 2021-06-25T10:23:51.165897+00:00 app[web.1]: Description is Promise { <pending> }

    // if (!game_query_result) {
    //    return; // what does this do in practice? I need it to error and restart if the game code is not a valid one in the games table
    // } 
} // end of GAME_DETAILS

// UPDATE GAME: Primary game management coding
async function update_game(room, io, db_connection) {
    if(!io.sockets.adapter.rooms.has(room)) {
       return; // error check in case there is no current game (room) in motion
    }
    if(!room.includes("game-")) {
	return; // error check in case a player ID gets confused in here
    }
   let game_code = room.replace("game-", "");
   console.log("Playing game", game_code);
   
    let display_query = `
       SELECT pl.id, pl.room_id, pl.updated_at,
              wp.name, wp.radius, round(ST_DISTANCE(wp.location, pl.location) * 100000) as "distance"
       FROM player as pl, waypoint as wp
       WHERE wp.game_code = '${game_code}' AND pl.room_id = '${game_code}' 
       ORDER BY pl.id
    `;
    let display_result = await db_connection.query(display_query);
    io.to(room).emit('room-display-update', display_result.rows);
    // io.to(room).emit('room-display-update', gamedescription, display_result.rows);
	      
    // How many waypoints are there in this game?
    let minimum_player_query = `SELECT minimum_players FROM games WHERE game_code = '${game_code}'`;
    let minimum_player_result = await db_connection.query(minimum_player_query); 
    let minimum_player_count = minimum_player_result.rows[0]["minimum_players"]
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
			winning_player.push(row.pl);
		}
	}
    }
    console.log(within_radius.length, "waypoints are currently occupied. By: ", winning_player);

    if (within_radius.length == minimum_player_count) {
    // if (within_radius.length == 1) { // for solo testing purposes
	let reward_query = `select reward from games where game_code = '${game_code}'`;
	let reward_result = await db_connection.query(reward_query); 
	let reward = reward_result.rows[0]["reward"]
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
    await configure_socketio(connection)
    console.log("System startup, clear all players");
	
    // Commence listening for client conenctions
    http.listen(PORT, () => console.log(`listening on *:${ PORT }`));
    while ( 1 == 1 ) {
	/* code to wait on goes here (sync or async) */    
	Array.from( io.sockets.adapter.rooms.keys() ).forEach(roomId => { // For each concurrently running game
		update_game(roomId, io, connection);
	});
		
    // wait 10 seconds between performing game updates
	await delay(10000)
    }
} // end of MAIN

main();  // RUN IT ALL!
