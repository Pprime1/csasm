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
  .get('/', (request, response) => {
    response.render('pages/index', {
      groupId: randomstring.generate({
          length: 5,
          charset: 'alphabetic'
        })
    })
  });

let db_connnection;

boot_database(CONNECTION_STRING).then(
  (pool) => {
    db_connnection = pool;
    http.listen(PORT, () => console.log(`listening on *:${ PORT }`));
  }
);

// End Startup Logic

io.on("connection", (socket) => {
    console.log('A user connected');

    socket.on('join-a-friend', (...args) => {
      let group_id = args[0];
      socket.join(group_id.to_s);

      let group_size = io.sockets.adapter.rooms.get(group_id.to_s).size

      console.log(`group ${group_id} has ${group_size}`)
      io.to(group_id.to_s).emit('group-join', group_id, group_size);

    });
     //Whenever someone disconnects this piece of code executed
     socket.on('disconnect', function () {
        console.log('A user disconnected');
     });
});

//Whenever someone connects this gets executed






// Express HTTP Server END
