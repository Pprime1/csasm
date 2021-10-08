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
- [x] Failed to send Game Description to be displayed
- [x] No error checking working for a valid game code
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
-[x] Sorted out the output table display

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
