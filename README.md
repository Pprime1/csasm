# CSASM -> ASMHUB #
**This is the Code Source repository for the Geocaching Anti-Social Mob Hub application (ASMHUB).**

The app requires multiple mobile devices, each connecting to the same source to determine if they are within a defined proximity radius of any waypoint location stored in a database table for a given Game-Code. The app displays _for the current player_ where they are on a map in relation to the target waypoints, highlighting if they are within one. It also keeps track of how far other players are from each waypoint, and will highlight any occupied waypoint on the map. Once all waypoints are occupied, the app returns hidden REWARD text value (eg: clues/directions to the final container) to each player that is occupying a waypoint.

## TODO ##
- [ ] reintroduce validatechecksums = true for the database tables. how to set/reset md5 values? (see https://github.com/Pprime1/csasm/issues/15)
- [x] make sure github code is hidden from everyone except Andrew and me. Database is secure, source code is harmless
- [x] shorten console.log for leaving game game-ID code (remove 'game-')
  - 2022-01-28T03:40:15.553001+00:00 app[web.1]: nNb7pC3X4vhRDbl1AAAD left game-GC9JEH6 0 online
  - 2022-01-28T03:40:15.553127+00:00 app[web.1]: All players have left game:  game-GC9JEH6
- [x] Push certain client console.logs to the server for centralised display
- [x] Push certain showmap console.logs to the server for centralised display
  -[🦖] May need to reduce the Update Circle logs?  
- [x] Reduce server console log entries in the ten second cycle
  - 2022-02-02T04:27:03.286916+00:00 app[web.1]: new player: aYDBQZvsPmGR0tqQAAAB
  - 2022-02-02T04:27:03.287646+00:00 app[web.1]: aYDBQZvsPmGR0tqQAAAB connected
  - 2022-02-02T04:27:18.532435+00:00 app[web.1]: Chosen Game is GCBETA : The Anti-Social-Mob cache: Beta test
  - 2022-02-02T04:27:18.532495+00:00 app[web.1]: new game: GCBETA
  - 2022-02-02T04:27:18.533278+00:00 app[web.1]: aYDBQZvsPmGR0tqQAAAB joined game-GCBETA 1 online
  - 2022-02-02T04:27:25.968680+00:00 app[web.1]: Playing game GCBETA
  - 2022-02-02T04:27:25.972407+00:00 app[web.1]: GCBETA requires 2 waypoints to be occupied.
  - 2022-02-02T04:27:25.972453+00:00 app[web.1]: 0 waypoints are currently occupied.
- [x] Can we siphon off the server console.logs for post action review? 
  - [x] Use a logging addon = LogEntries
    - [x] Need to add a valid credit card to Heroku
  - [ ] Setup dashboards, tags, alerts, filters ... learn to use LogEntries addon
- [x] Can we create a spoofing detector?
  - [x] accuracy checker for the chrome dev console (exactly 150m)
  - [x] android position.ismockprovider is true
  - [ ] lack of movement detector?
  - [ ] Can Gary test?

 

## Key files ##
[SERVER.JS](/server.js) : the primary engine (server side javascript creates and runs index.ejs) - no visibility of goings on to enduser (can only be seen in heroku console). Must socket.emit to communicate to client side javascript

[INDEX.EJS](/views/pages/index.ejs) : the calling script (client side html) to display stuff  - visible in console (F12).

[CLIENT.JS](/public/js/client.js) : the primary controller (client side javascript called from index.ejs) - visible in console (F12). 

[SHOWMAP.JS](/public/js/showmap.js) : the map code (client side javascript called from index.ejs) - visible in console (F12). 

[REWARD.EJS](/views/pages/reward.ejs) : the final reward display script (client side html) - visible in console (F12).


## Documentation ##
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
- [Heroku | ASMHUB appsite	](https://asmhub.herokuapp.com/)
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
