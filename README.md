# csasm
This is the source code repository for the Geocaching Anti-Social Mob application (ASM) - aka Covid Safe Anti-Social Mob (csasm).
The app runs on multiple mobile devices, each connecting to the same source to determine if they are within a proximity radius of any waypoint location stored in a database table for a given Game-Code.
If so, returns hidden REWARD text value (clues/directions to the final container). Otherwise restart the process (polling) to see if anything has changed.


# TODO
- [ ] reintroduce validatechecksums = true for the database tables. how to set/reset md5 values? (see https://github.com/Pprime1/csasm/issues/15)
- [x] Include some form of live map view on the screen cf: https://leafletjs.com/examples/quick-start/
  - [x] Centre on the current player's location
  - [ ] Have Circles for each waypoint
    - [ ] needs to convert geometry waypoint locations to WKT?
  - [ ] can we zoom map further in than 50m?
  - [ ] why doesn't the actual map tiles display by default?
  - [x] clear the playerloc pin once it updates?
  - [x] map update/pan on movement?
  - [x] make the displayed map bigger on screen? 1000px height x full device-width ==> set in the css stylesheet
  - [X] do we show other players? ... no:sleeping_bed:
  - [x] delay showmap.js from starting until the game actually starts
- [ ] create a live, outdoors, example for testing
  - [x] iphone testing
  - [ ] accuracy of location ... 13m?
  - [ ] usability for navigation from a distance
  - [ ] usability for navigationing when close
  - [ ] jitter?
- [ ] document/diagram of code flow
- [ ] https://stackoverflow.com/questions/47581575/only-request-geolocation-information-in-response-to-a-user-gesture/49406009#49406009

# Key files

[SERVER.JS](/server.js) : the primary engine (server side javascript creates and runs index.ejs) - no visibility of goings on to enduser (can only be seen in heroku console). Must socket.emit to communicate to client side javascript

[CLIENT.JS](/public/js/client.js) : the primary controller (client side javascript called from index.ejs) - visible in console (F12). 

[SHOWMAP.JS](/public/js/showmap.js) : the map code (client side javascript called from index.ejs) - visible in console (F12). 

[INDEX.EJS](/views/pages/index.ejs) : the calling script (client side html) to display stuff  - visible in console (F12).

[REWARD.EJS](/views/pages/reward.ejs) : the final reward display script (client side html) - visible in console (F12).



## Running Locally 
... unreliable still. code doesn't stay in sync with github?

```
heroku login -i \\ userID is prefilled but type the password
heroku pg:psql -a csasm \\ for database commands
```

### Installing
Make sure you have [Node.js](http://nodejs.org/) and the [Heroku CLI](https://cli.heroku.com/) installed.

```sh
$ git clone https://github.com/Pprime1/csasm # or clone your own fork
$ cd csasm
$ npm install
$ heroku local
```
Your app should now be running on [localhost:5000](http://localhost:5000/).

### Deploying to Heroku

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

- [markdown cheatsheet](https://github.com/tchapi/markdown-cheatsheet/blob/master/README.md)
