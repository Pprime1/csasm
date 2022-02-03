# HISTORY OF CODE DEVELOPMENT RELEASES #

**PRODUCTION RELEASE v1.0.19**
 - committed 4 February 2022
 - Build Release v1045 created by user pprime@live.com.au 2022-02-03T22:38:50
 - Production Code Release v19
- [👎] reintroduce validatechecksums = true for the database tables. how to set/reset md5 values? (see https://github.com/Pprime1/csasm/issues/15)
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
  - [x] Setup dashboards, tags, filters ... learn to use LogEntries addon
  - [👎] Email alerts on Game start and Game Reward - not happening?
- [x] Can we create a spoofing detector? "Anti-Gary mode enabled"
  - [x] accuracy checker for the chrome dev console (exactly 150m)
  - [x] android position.ismockprovider is true ... not sure this is overly reliable, but it's there
  - [👎] lack of movement detector? no FakeGPS simulates movement as well anyway.
  - [x] Gary test - passed, perfect
  

**PRODUCTION RELEASE v1.0.18**
 - committed 19 January 2022
 - Build Release v1000 created by user pprime@live.com.au 2022-01-18T23:21:24.320714+00:00
 - Production Code Release v18
- [x] GC Code input validation to also strip spaces, or at least trailling spaces = use str.trim()
- [x] Why is the Game Code not displaying on the main output? use current-GameID and GameId separately
- [x] Add extra GeoLocation error message/helpnote for users of Facebook Messenger (Android) - use a real browser!
- [x] rerun Testing Day 
  - booked for Friday 14/1/22 16:30
  - [x] Test old iphone
  - [x] Test iphone Go To Top exit button
  - [x] Test landscape on iphone
  - [ ] Test ipad
  - [x] Test Android tablet
  - [x] Test tablets in landscape
  - [x] Test Browser drop outs/reconnect
  - [x] test a refresh does an actual restart
  - [x] create GCBeta (2 waypoints) at QUT 
    - [x] run the test cases with 3 players
    - [x] check that no reward if not occupying a circle
    - [x] Multiple players at one circle at same time works at all?
      - [x] Do all get the reward?
  - [x] create GCGamma (3 waypoints) also at QUT
    - [x] run the test cases with 5 players
    - [x] does it work properly with 3 target circles?
    - [x] does it work with multiple concurrent games? (along with GCBeta)
      - [x] do seperate correct rewards happen to the right players?
- [x] Hide a container, create a real one: The Covid-Safe Anti Social Mob Cache
  - [x] Create for real GC9JEH6 code.
  - [x] Find a final GZ (S27° 28.327' E153° 1.373') 
    - Take a seat and reach behind the bottom outside corner of the metal plate behind you. Small (not micro) sized magnetic thin container
  - [x] build container, logbook and stash note
  - [x] test container in place
  - [x] FTF prizes? Coffee Club vouchers perhaps?
- [x] Final production test run, before publishing for real.
- [x] Production Release!!! 27 January 2022


**Pre-Prod v0.0.17 Branch #32**
      -merged 11 January 2022
- [👎] Can (and should?) I add a QLD Globe map layer. Just because? No! maybe a future release
- [x] How to deal with user making the map fullscreen? Can no longer see/scroll outside of the map. 
  - [x] put a "Go Top" button inside the map - use the player icon popup.
  - [x] Add a note about this in the userguide html
- [x] Write and refine what user instructions are needed - in listing, also available as a link
  - [x] publish asmhubGuide.html on Google Drive 2 Web
  - [x] Test run with OBC
  - [x] test with proposed Beta/Gamma testers
  - [x] Test with reviewers
- [👎] reintroduce validatechecksums = true for the database tables. how to set/reset md5 values? (see https://github.com/Pprime1/csasm/issues/15)
- [x] Rerun GCAlphatsts
- [x] remove default game from form - make it 'GC'?
  - [x] Test iphone Go To Top exit button
  - [x] Test landscape on iphone
- 👎👎 TESTING FAILED 👎👎
- 👎Reward data is not being pushed through to reward screen at all
    - [x] removed clearwatch from reward.ejs as it was failing. Reward data now flowing through
- 👎App Crashes repeatedly. "TypeError: callback is not a function" in server.js
- see issue#31 [https://github.com/Pprime1/csasm/issues/31]
    - [x] updated the socket.io.on("reconnect" function to ensure there is a callback included in the  socket.emit('join-a-game'  command
    - [x] tested with sending phone offline and forcing a reconnect
- [x] Create formalised test plans for use on testing day
 - [x] delete GCTest, GCAlbury and also GCAlphaTST, GCBetaTST GCGammaTSTS as they have private locations or are redundant now
    - keep GCBeta and GCGamma for future code testing. QUT is safe ground
    - Renamed GCAlphaTST as GCAlpha for consistency
   

**Code-Review 0.0.16 Branch #30**
      -merged 16 November 2021
- [x] Code review by someone ... Andrew!!
  - [x] There are a few occasions where storage of items in local storage looks excessive, there might be a purpose that I'm missing ... needed in reward.ejs
  - [x] Communicating with the map via global variables is bad practice. Goal is to have minimal global variables. 
  - [x] from a gameplay perspective - clearing the local storage on reward so quickly might cause issues aka maybe they close their phone and it refreshes the browser window.. then they lose the information and have to play the game again. sucks to be them then.
  - [x] personally, I would have had the map start-up with minimal logic related to our app 
  - [x] Expose map via global variable object? (like jQuery's $ function). We would then be able to call it via that function to make changes from our client.js.. e.g $MAP.update_table(...), $MAP.update_player(...) - it is working fine as it is
  - [x] Merging the two js files is a bad idea, making the code more complex, and if you decide in future that the map isn't working it makes removing much harder.
- [x] the map updates on a 5 second loop. Can it be called from watchposition(success,,) instead now?
  - [x] call the updatemap function (at least) from within the watchposition function in client.js - and therefore it would update constantly as the player moves around. 
  - [x] this is ok: Constant database update calls and all else happening rather than a more staid every 5 seconds is acceptable and normal
  - [x] code restructure to call all of startupmap inside client.js as well
- [ ]👎 How to deal with user making the map fullscreen? Can no longer see/scroll outside of the map. 
  - [ ]👎 Could use two-finger dragging for map movements, but that fails with the panBtn logic ... probably not fixable 
  - [x] Try a 80% width for map, but then user can just zoom further. still breaks!
- [x] how to have a development environment that is seperate from the production environment in case I want to make changes once we are live
  - [x] csasm is now pipeline to 'staging' and 'production' is now named asmhub
  - [x] Production promotion fails every time. (see https://github.com/Pprime1/csasm/issues/29)


**GCALPHATEST 0.0.15 Branch #28**
      -merged 28 October 2021
- [x] create a live, outdoors, example for testing:= GCALPHATST
  - [x] iphone testing
  - [x] accuracy of location ... watchposition gives best accuracy
  - [x] watchposition allows the player location actually update (see https://github.com/Pprime1/csasm/issues/27)
  - [ ] the map updates on a 5 second loop. Can it be called from watchposition(success,,) instead now?
    - [ ] is this even wise? Constant database update calls and all else happening rather than a more staid every 5 seconds
    - [ ] code restructure would be needed to place at least updatemap if not all of createmap inside client.js
  - [x] the playericon image was too hard to spot. now is a bright yellow background
  - [x] usability for navigation from a distance
    - [x] I don't feel there is value in creating a 'line' from playerLoc to each of the target circles? Can't easily tell which one they are going to so would have to be 2 (or more) directional lines which would look silly
  - [x] usability for navigationing when close. Zoom level is good
    - [x] jitter an issue? Once in the circle has to stay there until the other circles register as occupied as well.
- [x] review console.logs to ensure it's useful and not overly communicative
  - [x] when player leaves a circle console.log now notes that.
- [x] Quit game redirecting to geocaching.com website
- [x] Zooming switches on pauseAutoMove - detect currentmove flag needed again.
- [x] pauseAutoMove turning itself off immediately after turning it back on - detect currentmove flag needed again.
- [x] Leave room is not working properly - it is not properly updating playercount as per what it tells client. Is working in server.. 
  - [x] Table player_count is not updating after a player leaves (ie: 2 back down to 1)
  - [x] On leave room if there are now zero players do some form of end-game acknowledgement?
- [x] moved the Quit button below the map - or into the footer bar?

**panTo-Control-button 0.0.14 Branch #26**
      -merged 15 October 2021
- [x] zoom map further in than 50m
- [x] a toggle button on whether to pan the map or not
  - [x] change the button icon to reveal what mode it is in
  - [x] mousehover screen tooltip
- [x] a QUIT GAME button to properly stop it

**LIVE-MAP 0.0.13 Branch #25**
      -merged 12 October 2021
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

**ERROR-HANDLING v0.0.12 Branch #22**
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

**MERGE GROUPS v0.0.11 Branch #19**
      -merged 30 Jun 2021
- [x] merged the concepts of 'game', and 'group', they are the same thing
- [x] created display-reward
- [ ] started looking at error-handling (work to do)

**MERGE GROUPS v0.0.10 Branch #18**
      - merged 25 Jun 2021
- [x] Renamed Groups as Games in Index.ejs + relevant client.js
- [ ] Failed to send Game Description to be displayed
- [ ] No error checking working for a valid game code
- [x] Created Reward display output, including a copy button
- [x] Tested Room Reward system

**Redo potgrator v0.0.09 Branch #17**
      - merged 22 Jun 2021
- [x] Rebaselined the database, updated postgrator files
- [ ] validatechecksums is still false in app\database.js.

**Tidy code display v0.0.08 Branch #16**
      - merged 15 Jun 2021
- [x] fix the minor fixes that are now lost in the games-groups-rooms branch that is falling apart.
- [ ] has removed checksum checks in the app\database.js file as a workaround to Issue #8 NOT resolved, but can be ignored for now
- [x] Add a game using Albury as a location for testing

**Set occupied state v0.0.07 Branch #12**
      - merged 7 Jun 2021
- [x] Updated tabular output to highlight any row that has a player within the radius of a waypoint
- [x] Updated server.js to detect any waypoint with a player located within it's radius
- [x] This state is now available for use in the Reward routines
- [x] Current MYID variable
- [ ] no idea how to update the database to insert a new game
- [ ] need to merge the concepts of 'game', 'group' and 'room'
- [ ] need a routine to check if chosen 'room/group/game' is a valid one, and to error/restart if not
- [ ] Main display banner/footer (and table???) do not resize on smaller/mobile screens

**Prime dev v0.0.06 Branch #9**
      - merged 31 May 2021
- [x] Sorted out the output table display

**Prime display v0.0.05 Branch #6**
      - merged 27 May 2021
- [x] created a display table in a user friendly format.
- [ ] still need to sort the current ID (socket.id isn't it apparently) and also how to display current date time properly.

**Feature/pivot v0.0.04 Branch #3**
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

**Delete pre-existing-files directory v0.0.03 Branch #1**
      - merged 7 May 2021
      - _@Pprime1_
- [x] Delete pre-existing-files directory
- [x] First Pprime1 build, use workflows and processes

**Initial Heroku Build v0.0.02**
      - created 11 April 2021
      - _@andrewjud-daf_
- [x] fix: readme update, and added files from peters existing git
- [x] fix websocket for deployment and tie to http server rather than havin… …
- [x] postgrator treat newline as CRLF (windows)
- [x] disable validate checksum for postgrator... and update readme
- [x] impl: add api, and websocket functionality
- [x] create code base

**IMPLEMENT VISION v0.0.01**
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
