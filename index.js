const express = require('express')
const path = require('path')
const Postgrator = require('postgrator')
const bodyParser = require('body-parser');

var http = require("http")
const PORT = process.env.PORT || 5000

// Express HTTP Server Start
const app = express()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  
// Express HTTP Server END
  
/// DATABASE CONFIGURATION START
     
const connectionString = process.env.DATABASE_URL

const postgrator = new Postgrator({
  validateChecksums: true, // Set to false to skip validation,
  newline: 'CRLF', // Force using 'CRLF' (windows) or 'LF' (unix/mac)
  migrationDirectory: path.join(__dirname, 'postgrator'),
  driver: 'pg',
  ssl: { rejectUnauthorized: false },
  connectionString
})

console.log('Starting Database Migration.')

var server = http.createServer(app)

postgrator
  .migrate()
  .then((appliedMigrations) => {
    console.log(appliedMigrations)
    console.log('Database migrated successfully.')

    /*
     * Database has been migrated, all is good to go!
     */
	 
	// On startup delete all players!
	pool.query("DELETE FROM players").catch(error => {
		console.error(error.stack)
	}); 
	
	server.listen(PORT, () => console.log(`Server listening at ${ PORT }`))
  })
  .catch((error) => {
    console.error('Database migration failed!')
    console.error(error)
    process.exit(2)
  })
  
const parse = require('pg-connection-string').parse;
const PG_POOL = require('pg').Pool

var config = parse(connectionString)
// Amend Config to add SSL configuration
config = {
	...config,
	ssl: {
		rejectUnauthorized: false
	}
}

// DB Connection Pool 
const pool = new PG_POOL(config)

/// DATABASE CONFIGURATION END

/// API EXAMPLE START

var router = express.Router();     

router.route('/geocache')
	.post(function(req, res) { // accessed at POST http://localhost:5000/api/geocache
		// TODO - Make it possible to add new geocaches....
	})
    .get(function(req, res) { // get all the geocaches (accessed at GET http://localhost:5000/api/geocache)
	    pool.query('SELECT id, description, ST_X(location) AS longitude, ST_Y(location) AS latitude from geocaches', (error, results) => {
			if (error) {
			  res.send(error)
			} else {
			  res.json(results.rows)
			}
		});
    });
	

	
router.route('/geocache/nearby/:metres/:coordindates')
    .get(function(req, res) { // get all the geocaches (accessed at GET http://localhost:5000/api/geocache/nearby/:coordindates)
		let coordindates = req.params.coordindates;
		let metres = req.params.metres;
		
		let coordindateRegex = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/y;
		let result = coordindateRegex.exec(coordindates);
		let latitude = result[1];
		let longitude = result[3];
		
		// super rough query, for some reason i had to * by 100000 to get metres.. idk what I'm doing wrong with SRID settings in the database
		
		// TODO - likely should experiment with different SRID's - maybe 7850 (GDA2020 - Australian Geo standard) also likely a misunderstanding from my side on how 
		//  	postgis works. Although their examples show otherwise??? idk it seems to match the measurement tool from google maps... (within 1-2m)
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

	    pool.query(qry, (error, results) => {
			if (error) {
			  res.send(error)
			} else {
			  res.json(results.rows)
			}
		})
    });

app.use('/api', router);

// API EXAMPLE END


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