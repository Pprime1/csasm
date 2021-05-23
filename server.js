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

let db_connnection;

function roomUpdateHandler(roomId, io){
    if(!io.sockets.adapter.rooms.has(roomId)) {
       clearInterval(this)
       return;
    }

    console.log("Updating", roomId, "With Location Statuses")

    let game_code = "GCTEST"

    let location_query = `
      SELECT wp.waypoint_id, wp.name, wp.radius,
             pl.id as player_id, pl.room_id, pl.updated_at, round(ST_DISTANCE(wp.location, pl.location) * 100000) as "distance"
      FROM waypoint as wp, player as pl
      WHERE wp.game_code = '${game_code}' AND pl.room_id = '${roomId.replace("group-", "")}'
      `

    let reward_query = `select reward from games where game_code = '${game_code}'`

    db_connnection.query(location_query).then(result => {
        io.to(roomId).emit('room-location-update', result.rows);
      
        // TODO: Pass variables of current status data back to index.ejs to display in a table
        // var pl.id WHERE id= '${socket.id}' // this is current player?
        // var pl.location
        // var pl.updated_at
      
        // var wp.name
        // var wp.radius
        // var distance
  res.send(wp)    
      
        // TODO: determine whether they have "met the criteria" to succeed in the game?
        //  count all unique waypoint_id's with players within radius, if all expected
        //  waypoints have someone within radius sent each player in the room the reward string for display

        let success = false;
        if (success) {
          db_connnection.query(reward_query).then(game_reward => {
              io.to(roomId).emit('room-reward', game_reward.rows[0]);
          }).catch(err => console.log(err));
        }

    }).catch(err => console.log(err));

}

boot_database(CONNECTION_STRING).then(
  (pool) => {
    db_connnection = pool;
    // On Startup - Delete all players
    db_connnection.query("DELETE FROM player").catch(err => console.log(err));

    io.on("connection", (socket) => {
        console.log(socket.id, "connected");

        socket.on('location-update', (...args) => {
          let location_update_query = `
            UPDATE player
            set location = ST_GeomFromText('POINT(${args[0]} ${args[1]})', 3857)
            WHERE id = '${socket.id}'
          `
          db_connnection.query(location_update_query).catch(err => console.log(err))
          console.log(socket.id, "performed location update", args)
        })
        socket.on('join-a-group', (...args) => {
          // Join Requested Group if supplied, or create a group using randomized string
          let room_id = args.length > 0 ? args[0] : randomstring.generate({ length: 5, charset: 'alphabetic' });

          socket.join("group-" + room_id);
        });

    });


    // Handle Group Join / Leave - Inform users within group of changes (i.e. online amount)
    io.of("/").adapter.on("create-room", (room) => {
      console.log("creating-room", room)
      if (room.startsWith("group-")) {
        console.log("Scheduling Update Handler", room)
        // TODO: once this is being deployed increase time from 5000 (5 seconds) to 15000 (15 seconds)
        setInterval(roomUpdateHandler, 5000, room, io)
      }
    })
    io.of("/").adapter.on("join-room", (room, id) => {
      if(room !== id) {
        db_connnection.query(`INSERT INTO player(id, room_id) VALUES('${id}', '${room.replace("group-", "")}')`).catch(err => console.log(err));

        let room_size = io.sockets.adapter.rooms.get(room).size
        console.log(id, "joined", room, room_size, "online")
        io.to(room).emit("room-update", room.replace("group-", ""), room_size)
        // Inform user joining to update their UI because they joined a room
        io.to(id).emit("room-join")
      }
    })
    io.of("/").adapter.on("leave-room", (room, id) => {
      if(room !== id) {
        let room_size = io.sockets.adapter.rooms.get(room).size
        console.log(id, "left", room, room_size, "online")
        io.to(room).emit("room-update", room, room_size)

        db_connnection.query(`DELETE FROM player WHERE id = '${id}'`).catch(err => console.log(err));
      }
    })

    http.listen(PORT, () => console.log(`listening on *:${ PORT }`));
  }
);
