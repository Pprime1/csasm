# CSASM -> ASMHUB #
**This is the Code Source repository for the Geocaching Anti-Social Mob Hub application (ASMHUB).**

The app requires multiple mobile devices, each connecting to the same source to determine if they are within a defined proximity radius of any waypoint location stored in a database table for a given Game-Code. The app displays _for the current player_ where they are on a map in relation to the target waypoints, highlighting if they are within one. It also keeps track of how far other players are from each waypoint, and will highlight any occupied waypoint on the map. Once all waypoints are occupied, the app returns hidden REWARD text value (eg: clues/directions to the final container) to each player that is occupying a waypoint.

## TODO ##
- [?] reintroduce validatechecksums = true for the database tables. how to set/reset md5 values? (see https://github.com/Pprime1/csasm/issues/15)
- [x] Email alerts on Game start and Game Reward - only alerting once per minute and only if LogEntries screen is not active
- [x] Create a new game form
- [ ] Update versioning to be :  v[Functionality Release].[active Geocache games].[Release number]   {Build number}      is v1.1.20 {1050} currently
- [x] Put a 'Help' button top right of screen to UserGuide
- [x] Improve server log (GCALPHA : 0 of 2 waypoints occupied.) to indicate number of current players
- [x] Upgrade all npm audit componentry
  - [x] update engine.io and socket.io using npm audit fix (see issue https://github.com/Pprime1/csasm/issues/34_)
    - [x] Install Github Desktop and sync a clone of csasm
- [x] reduce further/cleanup the F12 - client console.logs
- [x] Update a LOGTX to show distance from each waypoint on updatemap
- [ ] What causes the "distance is null error"s?
  - [?] possibly running up on a computer with no GPS at all? 
  - [ ] Can I trap and log that - poserror perhaps?
  - [ ] Can I create a poserror, workaround or a helpful message?
- [x] Delay first display-updates until player's location has been determined
  - round(ST_DISTANCE(wp.location, pl.location) * 100000) as "distance" is returning null sometimes (early on)
  - [x] Delay startupmap until player location is known

 

## Key files ##
[SERVER.JS](/server.js) : the primary engine (server side javascript creates and runs index.ejs) - no visibility of goings on to enduser (can only be seen in heroku console). Must socket.emit to communicate to and from client side javascripts (c.f. socket.on(LOGX))

[INDEX.EJS](/views/pages/index.ejs) : the calling script (client side html) to display stuff  - visible in console (F12).

[CLIENT.JS](/public/js/client.js) : the primary controller (client side javascript called from index.ejs) - visible in console (F12). 

[SHOWMAP.JS](/public/js/showmap.js) : the map code (client side javascript called from index.ejs) - visible in console (F12). 

[REWARD.EJS](/views/pages/reward.ejs) : the final reward display script (client side html) - visible in console (F12).


## LINKS ##
- [Github Pprime1/csasm	](https://github.com/Pprime1/csasm)
- [Heroku Pipeline](https://dashboard.heroku.com/pipelines/8ac5b1b3-7f26-4c08-a927-f54f4c14888f)
- [csasm · Logs | Heroku	](https://dashboard.heroku.com/apps/csasm/logs)
- [Heroku Database page	](https://data.heroku.com/dataclips)
- [Heroku | ASMHUB appsite	](https://asmhub.herokuapp.com/)
- [The Anti-Social Mob Cache](https://www.geocaching.com/geocache/GC9JEH6_the-anti-social-mob?guid=c7d27f31-980c-42ea-bd66-545bb5d77874)
- [asmhub GUIDE](https://enblesp1msgzhmk140wukq-on.drv.tw/asmhub/asmhubGuide.html)
