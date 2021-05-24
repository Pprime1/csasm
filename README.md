# csasm
This is the source code repository for the Geocaching Anti-Social Mob application (ASM) - aka Covid Safe Anti-Social Mob (csasm).
The app runs on multiple mobile devices, each connecting to the same source to determine if they are within a proximity radius of any waypoint location stored in a database table for a given Game-Code.
If so, returns hidden REWARD text value (clues/directions to the final container). Otherwise restart the process (polling) to see if anything has changed.


# TODO

## 0. Learnings needed

0.1 How to define the wp array variable to contain the waypoint_information data to be displayed in index.ejs


## 1. Clean Up Code -

1.1 - Make application start with a selection of all valid Game-Codes, allowing user to select which game they are playing.

1.2 - merge the game code as room ID

1.3 - Present players ongoing information on where they are, how close all waypoints are to them and when their last location update was. In a neat table.

1.4 - Don't show information on other players until such time as current player is within the radius of a waypoint

1.5 - Throw players to an error page when they do not allow locations to be grabbed, and inform them how to fix this

1.6 - Shorter Player ID numbers ... no value in self-naming players but human usable IDs will help

XDONEX 1.7 - Force https so that Chrome android and others can get local device location

1.8 - remove redundant postgrator and other code in the csasm package

1.9 - will need to remove most client side console.log outputs for production use, can they be shifted to server side?


## 2. Implement Vision

2.1 - Keep track of which waypoints have a player currently in their radius (since last polling update) - set waypoint-occupied state as true (until next room poll occurs)

2.2 - When all waypoints have a player located in them - set waypoint-occupied state as true -  set reward-criteria as success

2.3 - Secure way of calling and displaying reward page once criteria are met and no other time. Stop screen refreshes, halt game.



## code logic explained (in Peter terms)

server.js    is the primary engine (server side javascript) - no visibility of goings on to enduser (can only be seen in heroku console). Must socket.emit to communicate to client side javascript

public/js/mobcache-socketio.js   is the primary controller (client side javascript) - visible in console (F12). 

views/pages/index.ejs    is the calling script (client side html) to display stuff  - visible in console (F12).




### Running Locally 
... unreliable still. code doesn't stay in sync with github?

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
