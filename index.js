const express = require('express')
const path = require('path')
var http = require("http")
const pool = require('./app/database').db_pool;
const PORT = process.env.PORT || 5000

// Express HTTP Server Start
const app = express()

app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))

// Express HTTP Server END

///// WEB SOCKET EXAMPLE

var WebSocket = require("ws")
var WebSocketServer = require("ws").Server

const url = require('url');
const querystring = require('querystring');

var wss = new WebSocketServer({server: server})

const map = new Map();

wss.on('connection', function connection(ws, request) {
	const username = querystring.decode(url.parse(request.url).query).name;
	map.set(username, ws);

	ws.on('message', function incoming(message) {
		let incomingMessage = JSON.parse(message);

		if(incomingMessage.type == "chat") {
			wss.clients.forEach(function each(client) {
			  if (client.readyState === WebSocket.OPEN) {
				client.send(
					JSON.stringify(
						{
							type: 'chat',
							content: `${username}: ${incomingMessage.content}`
						}
					)
				);
			  }
			});
		}
		if(incomingMessage.type == "location") {
			pool.query("UPDATE players set location = ST_GeomFromText('POINT(" + incomingMessage.latitude + " " + incomingMessage.longitude + ")', 3857) WHERE name = $1",
				[username]).catch(error => {
				console.error(error.stack)
			});

			// show places listed in geocache table as long as they're within 50,000 metres of my current location.
			let metres = 50000;

			let qry = `
				SELECT id, description,
				   round(ST_DISTANCE(
						location,
						ST_GeomFromText('POINT(${incomingMessage.latitude} ${incomingMessage.longitude})', 3857)) * 100000) as "distance (m2)"
					from geocaches
					WHERE
						ST_DISTANCE(
						location,
						ST_GeomFromText('POINT(${incomingMessage.latitude} ${incomingMessage.longitude})', 3857)) * 100000 <= ${metres}`;

			pool.query(qry, (error, results) => {
				if (error) {
				  console.error(error.stack);
				} else {
				  ws.send(
					JSON.stringify(
						{
							type: 'distance',
							content: results.rows
						}
					));
				}
			})
		}
	});

	wss.clients.forEach(function each(client) {
	  if (client.readyState === WebSocket.OPEN) {
		client.send(
			JSON.stringify(
				{
					type: 'chat',
					content: `${username} has joined the chat!`
				}
			)
		);
	  }
	});

	ws.on('close', function () {
		pool.query("DELETE FROM players WHERE name = $1", [username]).catch(error => {
			console.error(error.stack)
		});
		map.delete(username);
	});

	pool.query("INSERT INTO players(name) VALUES($1)", [username])
		.catch(error => {
			console.error(error.stack)
			ws.close();
		});

});



/// WEB SOCKET EXAMPLE END
