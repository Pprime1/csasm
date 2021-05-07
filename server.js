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
    if(!io.sockets.adapter.rooms[roomId]) {
       clearInterval(this)
       return;
    }

    console.log("Updating", roomId, "With Location Statuses")

    SELECT wp.waypoint_id, wp.game_code, wp.name FROM waypoint AS wp;


    let qry = `
      SELECT id, description,
         round(ST_DISTANCE(
          location,
          ST_GeomFromText('POINT(${latitude} ${longitude})', 3857)) * 100000) as "distance (m2)"
        from geocaches
        WHERE
          ST_DISTANCE(
          location,
          ST_GeomFromText('POINT(${latitude} ${longitude})', 3857)) * 100000 <= ${metres}`;

    io.to(roomId).emit('room-location-update', { none: "hello" });
}

boot_database(CONNECTION_STRING).then(
  (pool) => {
    db_connnection = pool;
    // On Startup - Delete all players
    db_connnection.query("DELETE FROM player").catch(err => console.log(err));

    io.on("connection", (socket) => {
        console.log(socket.id, "connected");

        socket.on('location-update', (...args) => {
          // TODO - validate arg[0], and arg[1] exist
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

          // TODO: We should check whether they're in any other rooms (other than their own personal room)..
          //  and leave them; unless it matches the provided room_id

          socket.join("group-" + room_id);
        });

    });


    // Handle Group Join / Leave - Inform users within group of changes (i.e. online amount)
    io.of("/").adapter.on("create-room", (room) => {
      if (room.startsWith("group-")) {
        setInterval(roomUpdateHandler, 60000, room, io)
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
