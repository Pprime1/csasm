# csasm
This is the source code repository for the Geocaching Anti-Social Mob application (ASM) - aka Covid Safe Anti-Social Mob (csasm).
The app runs on two mobile devices, each connecting to the same data source to determine if they are within a proximity radius of either of the locations stored.
If they are within range the timestamp is updated for that location
It then checks if the timestamp of both locations is within 30 seconds of current time - ie: are both locations currently occupied?
If so, returns hidden text value. Otherwise restart the process (polling) to see if anything has changed.

Options to be included once base code is working
1. Allow a three-location ASM
2. Allow multiple different ASMs called by a 'GCCODE' as to which one is being attempted

# TODO

1. Clean Up Code -
1.1 - Make application start with a "Login button" and allow user to input their own name before proceeding
1.2 - Make application start without websocket automatically connecting.
1.3 - Give players information on when their last location update was...
1.4 - Throw players to an error page when they do not allow locations to be grabbed, and inform them how to fix this
1.5 - Move javascript code into a .js file, and attempt minimise global variable usage (other than websocket) 
1.6 - Remove api logic if it isn't going to be used
1.7 - Websocket - Implement Heartbreak to prevent it from expiring. Heroku expired my websocket connection for some reason..? H15 error??
1.8 - Websocket - Decide whether to keep chat, if chat remains we need to add scrolling ---- Probably not best format for Mobile environment... 
1.9 - Performance - Location update every 60s for every player - it would be a performance drain when too many people have connected 

2. Implement Vision
2.1 - geocache table contains information about points of interest - e.g "Andrews Place"... if we wanted we could add a third table to link them to a "GCCODE"
		then look for all players updated in last 5 minutes and see whether they're near any of the places for our GCCODE, 
			if any are send that as an update to all users for same GCCODE
2.2 - When all players occupy the correct locations send further information in the "distance" update to congratulate them?

3. Budget Concerns
3.1 - Postgres allows for 10k rows, we store player information in the database whilst they're connected. 
		This means we are allowed to have (10k - geocache.rows - othertables.rows) players
		This should be tracked to whether it is still appropriate 

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
