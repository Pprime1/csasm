# CSASM -> ASMHUB #
**This is the Code Source repository for the Geocaching Anti-Social Mob Hub application (ASMHUB).**

The app requires multiple mobile devices, each connecting to the same source to determine if they are within a defined proximity radius of any waypoint location stored in a database table for a given Game-Code. The app displays _for the current player_ where they are on a map in relation to the target waypoints, highlighting if they are within one. It also keeps track of how far other players are from each waypoint, and will highlight any occupied waypoint on the map. Once all waypoints are occupied, the app returns hidden REWARD text value (eg: clues/directions to the final container) to each player that is occupying a waypoint.

## TODO ##
- [ ] Shrewsbury Park'n'Ride ASM cache for Mega?

 
## Versioning vN.G.PR ##
Where:
- N = Game Version (1 until a major change)
- G = Number of Production Games (not counting test games)
- PR = Production Code Release version from Heroku
and the Development Code release number is noted in changelog.md document as well.

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
