# csasm
This is the source code repository for the Geocaching Anti-Social Mob application (ASM) - aka Covid Safe Anti-Social Mob (csasm).
The app runs on multiple mobile devices, each connecting to the same source to determine if they are within a proximity radius of any waypoint location stored in a database table for a given Game-Code.
If so, returns hidden REWARD text value (clues/directions to the final container). Otherwise restart the process (polling) to see if anything has changed.


# TODO

## 1. Clean Up Code -

1.1 - Make application start with a selection of all valid Game-Codes, allowing user to select which game they are playing. - update can use ROOM selector

1.2 - merge the game code as room ID - DONE but need error/validity checking

1.3 - Throw players to an error page when they do not allow locations to be grabbed, and inform them how to fix this

xCANCELx1.4 - remove redundant postgrator code ... there is a player, players, recreate players and pivot players table? drop geocache?

xDONEx1.5 - location_query and display_query duplicating the same thing but inverted. Can we remove location_query?

1.6 - How to add new game data into postgrator



## 2. Implement Vision

2.1 - Keep track of which waypoints have a player currently in their radius (since last polling update) - set waypoint-occupied state as true (until next room poll occurs)

2.2 - When all waypoints have a player located in them - ie: waypoint-occupied state as true -  set success as true and run reward-criteria routine

2.3 - Secure way of calling and displaying reward page once criteria are met and no other time. Stop screen refreshes, halt game.



## code logic explained (in Peter terms)

server.js    is the primary engine (server side javascript creates and runs index.ejs) - no visibility of goings on to enduser (can only be seen in heroku console). Must socket.emit to communicate to client side javascript

public/js/client.js   is the primary controller (client side javascript called from index.ejs) - visible in console (F12). 

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
