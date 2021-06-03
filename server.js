const express = require('express');
const app = require('express')();
const http = require("http").createServer(app);
const io = require('socket.io')(http);

const path = require('path')
const randomstring = require ('randomstring');

// Our Imports
const boot_database = require('./app/database').db;

// configuration
const PORT = process.env.PORT || 5000;
const CONNECTION_STRING = process.env.DATABASE_URL;

// Startup Logic
app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (request, response) => response.render('pages/index'));

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
    
        socket.on('join-a-group', (...args) => {
           // Join Requested Group if supplied, or create a group using randomized string
           let room_id = args.length > 0 ? args[0] : randomstring.generate({ length: 5, charset: 'alphabetic' });
           socket.join("group-" + room_id);
        }); // join-a-group
    }); // connection

    // Handle Group Join / Leave - Inform users within group of changes (i.e. online amount)
    io.of("/").adapter.on("create-room", (room) => {
      console.log("creating-room", room);
      if (room.startsWith("group-")) {
        //console.log("Scheduling Update Handler", room);
        //setInterval(roomUpdateHandler, 5000, room, io, connection);
      }
    }); // create-room
    
    io.of("/").adapter.on("join-room", (room, id) => {
      if(room !== id) {
        db_connection.query(`INSERT INTO player(id, room_id) VALUES('${id}', '${room.replace("group-", "")}')`).catch(err => console.log(err));

        let room_size = io.sockets.adapter.rooms.get(room).size;
        console.log(id, "joined", room, room_size, "online");
        io.to(room).emit("room-update", room.replace("group-", ""), room_size);
        io.to(id).emit("room-join"); // Inform user joining to update their UI because they joined a room    
      }
    }); // join-room
    
    io.of("/").adapter.on("leave-room", (room, id) => {
      if(room !== id) {
        let room_size = io.sockets.adapter.rooms.get(room).size;
        console.log(id, "left", room, room_size, "online");
        io.to(room).emit("room-update", room.replace("group-", ""), room_size);
        db_connection.query(`DELETE FROM player WHERE id = '${id}'`).catch(err => console.log(err));
      }
    }); // leave-room	
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function update_game(roomId, io, db_connection) {
	if(!io.sockets.adapter.rooms.has(roomId)) {
       return;
    }
	
	if(!roomId.includes("group-")) {
		return;
	}
	
	let game_code = roomId.replace("group-", "");   // merging game and room_id, but needs validity checking subroutines
    console.log("Updating game", game_code);
   
    let display_query = `
       SELECT pl.id, pl.room_id, pl.updated_at,
              wp.name, wp.radius, round(ST_DISTANCE(wp.location, pl.location) * 100000) as "distance"
       FROM player as pl, waypoint as wp
       WHERE wp.game_code = '${game_code}' AND pl.room_id = '${game_code}' 
       ORDER BY pl.id
    `;
    let display_result = await db_connection.query(display_query);
	io.to(roomId).emit('room-display-update', display_result.rows);
      
	// TODO: determine whether they have "met the criteria" to succeed in the game!
	// For each waypoint in this game,
	//      if distance <= radius FOR ANY PLAYER, then set occupied = true ... should this be in the database itself (which I cannot update) or in an array?
	//      if all waypoints.occupied are true then game.success = true, else reset all occupied statuses to false prior to next checkup
	// Approach options: Using an array same length as the number of waypoints for this game, check for each waypoint if distance <= radius and set occupied

	// How many waypoints are there in this game? minimum_players in games table should know this?
	let minimum_player_query = `SELECT minimum_players FROM games WHERE game_code = '${game_code}'`;
	let minimum_player_result = await db_connection.query(minimum_player_query); 
	let minimum_player_count = minimum_player_result.rows[0]["minimum_players"]

	console.log(game_code, "requires at least", minimum_player_count, "players"); 
	  
	var within_radius = [];
	for (var i = 0; i < display_result.rows.length; i++) {
		var row = display_result.rows[i];
		
		var distance = row.distance;
		var radius = row.radius;
		
		if(distance != null) {	
			if ( !within_radius.includes(row.name) && distance <= radius ) {
				within_radius.push(row.name);
			}
		}
	}
	
	console.log(within_radius.length, "are currently occupied");

	if (within_radius.length >= minimum_player_count) {
		let reward_query = `select reward from games where game_code = '${game_code}'`;
		let reward_result = await db_connection.query(reward_query); 
		let reward = reward_result.rows[0]["reward"]
	
		io.to(roomId).emit('room-reward', reward);
	}
}

async function main() {
	let connection = await boot_database(CONNECTION_STRING);
	
	// On Startup - Delete all players
    await connection.query("DELETE FROM player").catch(err => console.log(err));
	
	// On Startup - Configure SocketIo
	await configure_socketio(connection)

    http.listen(PORT, () => console.log(`listening on *:${ PORT }`));
	
	while ( 1 == 1 ) {
		/* code to wait on goes here (sync or async) */    
		Array.from( io.sockets.adapter.rooms.keys() ).forEach(roomId => {
			update_game(roomId, io, connection);
		});
		
    // wait 10 seconds between performing game updates
		await delay(10000)
	}
}	

main();
