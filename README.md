# csasm
This is the source code repository for the Geocaching Anti-Social Mob application (ASM) - aka Covid Safe Anti-Social Mob (csasm).
The app runs on multiple mobile devices, each connecting to the same source to determine if they are within a proximity radius of any waypoint location stored in a database table for a given Game-Code.
If so, returns hidden REWARD text value (clues/directions to the final container). Otherwise restart the process (polling) to see if anything has changed.


# TODO

1. need a routine to check if chosen game is a valid one, and to error/restart if not ... or can we display all valid games as buttons and "pick game"?
2. Check the timeouts - time to refresh player location (should be 5000ms?), refresh room contents (should be 10000ms?)
3. Throw players to an error page when they do not allow locations to be grabbed, and inform them how to fix this. Note that on mobiles the location permission is not 'sticky' when launched from facebook messenger (facebook browser). This is fixed if player launches it in a real browser
4. Check that update location is actually updating - inside house tests it is never changing location
5. Only display Reward to those players currently occupying any waypoint (thwart game-jumpers)
6. Once Reward is displayed, stop all screen and location updates
7. How can I grab the Game Description and display it ? Promise rejections again 👎
8. reintroduce validatechecksums = true for the database tables. how to set/reset md5 values?
9. Is it a good idea to include some form of live map view on the screen? cf: https://github.com/googlemaps/js-samples/blob/master/dist/samples/map-geolocation/index.js


# Key files
.[SERVER.JS](/server.js) : the primary engine (server side javascript creates and runs index.ejs) - no visibility of goings on to enduser (can only be seen in heroku console). Must socket.emit to communicate to client side javascript
.[CLIENT.JS](/public/js/client.js) : the primary controller (client side javascript called from index.ejs) - visible in console (F12). 
.[INDEX.EJS](/views/pages/index.ejs) : the calling script (client side html) to display stuff  - visible in console (F12).
.[REWARD.EJS](/views/pages/reward.ejs) : the final reward display script (client side html) - visible in console (F12).



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
