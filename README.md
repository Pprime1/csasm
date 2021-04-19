# csasm
This is the source code repository for the Geocaching Anti-Social Mob application (ASM) - aka Covid Safe Anti-Social Mob (csasm).
The app runs on two mobile devices, each connecting to the same data source to determine if they are within a proximity radius of either of the waypoint locations stored in a database table.
If one is within range of a waypoint location the timestamp is updated for that location
It then checks if the timestamp of both locations is within 30 seconds of current time - ie: are both locations currently occupied?
If so, returns hidden text value. Otherwise restart the process (polling) to see if anything has changed.

Options to be included once base code is working
1. Allow a three-location ASM (ie: three players at three differnet waypoint locations simultaneously. Will never want to make it bigger than that. 


# TODO

1. Clean Up Code -

X1.1 - Make application start with a "Login button" and allow user to input their own name before proceeding

X1.2 - Make application start without websocket automatically connecting.

X1.3 - Give players information on when their last location update was...

1.4 - Throw players to an error page when they do not allow locations to be grabbed, and inform them how to fix this

1.5 - Move javascript code into a .js file, and attempt minimise global variable usage (other than websocket) 

1.6 - Remove api logic if it isn't going to be used

1.7 - Websocket - Implement Heartbreak to prevent it from expiring. Heroku expired my websocket connection for some reason..? H15 error??

X1.8 - Websocket - Decide whether to keep chat, if chat remains we need to add scrolling ---- Probably not best format for Mobile environment... 

1.9 - Performance - Location update every 60s for every player - it would be a performance drain when too many people have connected 

1.A - Remove the chat function, utilise the ASM database table

1.B - investigate Android Chrome browser as this does not appear to allow (or even ask) for geolocation


# 2. Implement Vision
X2.1 - geocache table contains information about points of interest - e.g "Andrews Place"... if we wanted we could add a third table to link them to a "GCCODE"
		then look for all players updated in last 5 minutes and see whether they're near any of the places for our GCCODE, 
			if any are send that as an update to all users for same GCCODE
2.2 - When all players occupy the correct locations send further information in the "distance" update to congratulate them?

2.A - Implement a "which game' feature, possibly as a command line call ie: https://csasm.herokuapp.com/?GCCODE

2.B - Compare current player's location to both waypoint locations in the ASM table for the current 'game' ... display distance from each, and display current time as reference

2.C - IF player is closer to either waypoint location than the specified 'radius' distance, then update the timestamp of that waypoint to current time

2.D - AND THEN check if the timestamp for the other waypoint location is also within 30 seconds of current time, if it is then both locations are occupied, = SUCCESS

2.E - IF NOT SUCCESS, display an encouragement message and re-poll

2.F - IF SUCCESS, ie: both waypoint locations are currently occupied by a player, THEN display SUCCESS MESSAGE and halt.


3. Budget Concerns
X3.1 - Postgres allows for 10k rows, we store player information in the database whilst they're connected. 
X		This means we are allowed to have (10k - geocache.rows - othertables.rows) players
X		This should be tracked to whether it is still appropriate 


## code logic explained (in Peter terms)

(js) index.js is the primary engine (server side)

(ejs) views/pages/index.ejs is the calling script (client side)

ejs gets current user location and sends to js (websocket message)

js gets that location and updates 'players table' and then calculates distance from 'geocaches table' location

js returns distance and description of the 'geocaches table' locaiton

ejs receives the returned data and displays it and then re-polls 60 seconds later (?not tested)

There is also a chat feature currently also implemented (not required)



## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku CLI](https://cli.heroku.com/) installed.

```sh
$ git clone https://github.com/Pprime1/csasm # or clone your own fork
$ cd csasm
$ npm install

$ heroku local
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku

```
$ heroku git:remote -a csasm
$ git push heroku main
$ heroku open
```
or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## Documentation

For more information about using Node.js on Heroku, see these Dev Center articles:

- [Getting Started on Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
- [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)
