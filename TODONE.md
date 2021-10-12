**HISTORY OF CODE DEVELOPMENT BRANCHES**

**LIVE-MAP #nn branch**
- [ ] reintroduce validatechecksums = true for the database tables. how to set/reset md5 values? (see https://github.com/Pprime1/csasm/issues/15)
- [x] Include some form of live map view on the screen cf: https://leafletjs.com/examples/quick-start/
  - [x] Centre on the current player's location
  - [x] Have Circles for each waypoint
    - [x] needs to convert geometry waypoint locations to WKT
    - [x] need to update the colour of them with updatemap updates
    - [x] colour the circle yellow if anyone is occupying, colour it green if current player is occupying, otherwise red when not occupied by anyone
  - [x] map update/pan on movement?
  - [x] make the displayed map bigger on screen? 1000px height x full device-width ==> set in the css stylesheet
      - do we show other players on map? ... no:sleeping_bed:
  - [x] delay showmap.js from starting until the game actually starts
    - [x] why doesn't the actual map tiles display by default at startup? Maybe delay first display until is_running? 
  - [x] change the person marker icon to be a person 
    - [x] simplify the icon URL ... use '/js/personicon.png' not '../../personicon.png' 
  - [ ] can we zoom map further in than 50m?
  - [ ] Can we have a toggle on whether to pan the map or not?
  - [x] clear the playerloc pin once it updates?
  - [x] iphone testing
- [x] document/diagram of code flow
- [x] can Heroku auto-restart the dyno on application crash?
   - it does usually. https://devcenter.heroku.com/articles/dynos
   - only usecase it doesn't is a crashed build (eg: attemnpt to build whilst a player still active)
- [x] I don't care? https://stackoverflow.com/questions/47581575/only-request-geolocation-information-in-response-to-a-user-gesture/49406009#49406009
- [x] track down all the todo's from earlier branches and store them in a seperate file perhaps? There is a bit of a history of development emerging here

**ERROR-HANDLING #22 branch**
      -merged 19 Jul 2021
- [x] Routine to check if chosen game is a valid one, and to error/restart if not
- [x] Check the timeouts - time to refresh player location (should be 5000ms?), refresh room contents (should be 10000ms?)
- [x] Throw players to an error when they do not allow locations to be grabbed, and inform them how to fix this.
- [x] Check that update location is actually updating - inside house tests it is never changing location
- [x] Only display Reward to those players currently occupying any waypoint (thwart game-jumpers)
- [x] Once Reward is displayed, stop all screen and location updates
- [x] grab the Game Description and display it
- [ ] reintroduce validatechecksums = true for the database tables. how to set/reset md5 values?
- [ ] Is it possible to include some form of live map view on the screen? cf: https://github.com/googlemaps/js-samples/blob/master/dist/samples/map-geolocation/index.js
- [x] Can we start the game directly to a pre-filled GC code eg: https://csasm.herokuapp.com/?GCTEST ?

**MERGE GROUPS #19 branch**
      -merged 30 Jun 2021
- [x] merged the concepts of 'game', and 'group', they are the same thing
- [x] created display-reward
- [ ] started looking at error-handling (work to do)

**MERGE GROUPS #18 branch**
      - merged 25 Jun 2021
- [x] Renamed Groups as Games in Index.ejs + relevant client.js
- [ ] Failed to send Game Description to be displayed
- [ ] No error checking working for a valid game code
- [x] Created Reward display output, including a copy button
- [x] Tested Room Reward system

**Redo potgrator #17 branch**
      - merged 22 Jun 2021
- [x] Rebaselined the database, updated postgrator files
- [ ] validatechecksums is still false in app\database.js.

**Tidy code display #16 branch**
      - merged 15 Jun 2021
- [x] fix the minor fixes that are now lost in the games-groups-rooms branch that is falling apart.

**Postgrator updating to add GCALBURY test game #13 branch**
      - merged 7 Jun 2021
- [ ] has removed checksum checks in the app\database.js file as a workaround to Issue #8 NOT resolved, but can be ignored for now
- [x] Add a game using Albury as a location for testing

**Set occupied state #12 branch**
      - merged 7 Jun 2021
- [x] Updated tabular output to highlight any row that has a player within the radius of a waypoint
- [x] Updated server.js to detect any waypoint with a player located within it's radius
- [x] This state is now available for use in the Reward routines
- [x] Current MYID variable
- [ ] no idea how to update the database to insert a new game
- [ ] need to merge the concepts of 'game', 'group' and 'room'
- [ ] need a routine to check if chosen 'room/group/game' is a valid one, and to error/restart if not
- [ ] Main display banner/footer (and table???) do not resize on smaller/mobile screens

**Prime dev #9 branch**
      - merged 31 May 2021
- [x] Sorted out the output table display

**Prime display #6 branch**
      - merged 27 May 2021
- [x] created a display table in a user friendly format.
- [ ] still need to sort the current ID (socket.id isn't it apparently) and also how to display current date time properly.

**Feature/pivot #3 branch**
      - merged 11 May 2021
      - _@andrewjud-daf_
- [x] Added communication between client and server for reward and location information.
- [ ] Few TODOS left mainly related to the actual game and whether all players have met the criteria.
            - Server.js line 49, 50, 51, and 97
            - mobcache-socketio.js line 43, 44, and 53
- [x] pivot project slightly, remove unrequired files, clean-up code
- [x] Merge branch 'main' of https://github.com/Pprime1/csasm into feature/… 
- [x] startup logic
- [x] Merge branch 'main' into feature/pivot
- [x] merge readme changes
- [x] improved room handling logic, and added player table
- [x] improve game interaction with room and players.. add some sql actions
- [x] improve server -> client communication, begin query for all players i… 
- [x] impl query for distances from each waypoint, and add todo statements … 
- [x] remove nodemon, and revert to using node for production

**Delete pre-existing-files directory #1 branch**
      - merged 7 May 2021
- [x] Delete pre-existing-files directory

**Initial Build main**
      - created 11 April 2021
      - _@andrewjud-daf_
- [x] fix: readme update, and added files from peters existing git
- [x] fix websocket for deployment and tie to http server rather than havin… …
- [x] postgrator treat newline as CRLF (windows)
- [x] disable validate checksum for postgrator... and update readme
- [x] impl: add api, and websocket functionality
- [x] create code base

**IMPLEMENT VISION**
- 1 - geocache table contains information about points of interest - e.g "Andrews Place"... if we wanted we could add a third table to link them to a "GCCODE" then look for all players updated in last 5 minutes and see whether they're near any of the places for our GCCODE, if any are send that as an update to all users for same GCCODE 2.2 - When all players occupy the correct locations send further information in the "distance" update to congratulate them?

- 2A - Implement a "which game' feature, possibly as a command line call ie: https://csasm.herokuapp.com/?GCCODE
- 2B - Compare current player's location to both waypoint locations in the ASM table for the current 'game' ... display distance from each, and display current time as reference
- 2C - IF player is closer to either waypoint location than the specified 'radius' distance, then update the timestamp of that waypoint to current time
- 2D - AND THEN check if the timestamp for the other waypoint location is also within 30 seconds of current time, if it is then both locations are occupied, = SUCCESS
- 2E - IF NOT SUCCESS, display an encouragement message and re-poll
- 2F - IF SUCCESS, ie: both waypoint locations are currently occupied by a player, THEN display SUCCESS MESSAGE and halt.

- 3 Budget Concerns - Postgres allows for 10k rows, we store player information in the database whilst they're connected. 
  - This means we are allowed to have (10k - geocache.rows - othertables.rows) players 
  - This should be tracked to whether it is still appropriate
