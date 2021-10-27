# csasm
This is the source code repository for the Geocaching Anti-Social Mob application (ASM) - aka Covid Safe Anti-Social Mob (csasm).
The app requires multiple mobile devices, each connecting to the same source to determine if they are within a proximity radius of any waypoint location stored in a database table for a given Game-Code. The app displays for the current player where they are on a map in relation to the target waypoints, highlighting if they are within one. It also keeps track of how far other players are from each waypoint, and will highlight any occupied waypoint on the map. Once all waypoints are occupied, the app returns hidden REWARD text value (clues/directions to the final container) to each player that is occupying a waypoint.


# TODO
- [ ] Code review by someone ... Andrew!!

- [ ] the map updates on a 5 second loop. Can it be called from watchposition(success,,) instead now?
  - [ ] is this even wise? Constant database update calls and all else happening rather than a more staid every 5 seconds
  - [ ] code restructure would be needed to place at least updatemap if not all of createmap inside client.js
- [ ] how to have a development environment that is seperate from the production environment in case I want to make changes once we are live
- [ ] reintroduce validatechecksums = true for the database tables. how to set/reset md5 values? (see https://github.com/Pprime1/csasm/issues/15)
- [ ] create GCBetaTst at QUT - run the test cases with 3 players
  - [ ] check that no reward if not occupying a circle
  - [ ] Multiple players at one circle at same time works at all?
    - [ ] Do all get the reward?
- [ ] create GCGammaTst (3 waypoints) also at QUT - run the test cases with 5 players
  - [ ] does it work properly with 3 target circles?
  - [ ] does it work with multiple concurrent games? (along with GCBetaTst)
      - [ ] do seperate correct rewards happen to the right players?
- [ ] Hide a container, create a real one: The Covid-Safe Anti Social Mob Cache
  - [ ] delete GCTest, GCAlbury as they have private locations
    - [ ] keep GCBetaTst and GCGammaTst for future code testing. QUT is safe ground
  - [ ] 'replace' GCAlphatst with the real GC code. Or possibly just duplicate locations
  - [ ] Write and refine what user instructions are needed - into listing,
    - [ ] but also should it be in the code somewhere?
    - [ ] OBC co-ownership on the listing?
  - [ ] remove default game from form
  - [ ] Final production test run, before publishing for real. Use two new people.
  - [ ] Production Release!
 

# Key files

[SERVER.JS](/server.js) : the primary engine (server side javascript creates and runs index.ejs) - no visibility of goings on to enduser (can only be seen in heroku console). Must socket.emit to communicate to client side javascript

[INDEX.EJS](/views/pages/index.ejs) : the calling script (client side html) to display stuff  - visible in console (F12).

[CLIENT.JS](/public/js/client.js) : the primary controller (client side javascript called from index.ejs) - visible in console (F12). 

[SHOWMAP.JS](/public/js/showmap.js) : the map code (client side javascript called from index.ejs) - visible in console (F12). 

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

- [Github Pprime1/csasm	](https://github.com/Pprime1/csasm)
- [csasm · Logs | Heroku	](https://dashboard.heroku.com/apps/csasm/logs)
- [Heroku Dashboard csasm 	](https://dashboard.heroku.com/apps/csasm/deploy/heroku-git)
- [Heroku Database page	](https://data.heroku.com/dataclips)
- [eroku | CSASM appsite	](https://csasm.herokuapp.com/)
- [Stack Overflow	](https://stackoverflow.com/questions)
- [Badges · Bootstrap	](https://getbootstrap.com/docs/4.4/components/badge/)
- [SHint, a JavaScript Code Quality Tool	](https://jshint.com/)
- [Rooms | Socket.IO	](https://socket.io/docs/v3/rooms/index.html)
- [Emitting events | Socket.IO	](https://socket.io/docs/v4/emitting-events/#Acknowledgements)
- [js-samples/index.js at 8c8a2e163d4df2279cc9aa54948b798b80d95056 · googlemaps/js-samples · GitHub 	](https://github.com/googlemaps/js-samples/blob/8c8a2e163d4df2279cc9aa54948b798b80d95056/dist/samples/map-geolocation/index.js)
- [Account | Mapbox	](https://account.mapbox.com/access-tokens)
- [Quick Start Guide - Leaflet - a JavaScript library for interactive maps	](https://leafletjs.com/examples/quick-start/)
- [Documentation - Leaflet - a JavaScript library for interactive maps 	](https://leafletjs.com/reference-1.6.0.html#control)
- [Read Leaflet Tips and Tricks | Leanpub 	](https://leanpub.com/leaflet-tips-and-tricks/read)
- [javascript - How to update multiple marker location simultaneously using JSON data? Leaflet JS - Stack Overflow 	](https://stackoverflow.com/questions/32731916/how-to-update-multiple-marker-location-simultaneously-using-json-data-leaflet-js)
- [Zoom further in than level 19 with leaflet javascript API? - Geographic Information Systems Stack Exchange 	](https://gis.stackexchange.com/questions/78843/zoom-further-in-than-level-19-with-leaflet-javascript-api)
- [Edit fiddle - JSFiddle - Code Playground 	](http://jsfiddle.net/fqt7L/1/)
