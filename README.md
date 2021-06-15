# csasm
This is the source code repository for the Geocaching Anti-Social Mob application (ASM) - aka Covid Safe Anti-Social Mob (csasm).
The app runs on multiple mobile devices, each connecting to the same source to determine if they are within a proximity radius of any waypoint location stored in a database table for a given Game-Code.
If so, returns hidden REWARD text value (clues/directions to the final container). Otherwise restart the process (polling) to see if anything has changed.


# TODO

## Clean Up Code -

1. to update the database and insert a new game see 008.do.GCALBURY-game.sql note also that checksum validation is false in app/database.js now

1.1 see Database Updates Issue#15 for ongoing database management matters

2. need to merge the concepts of 'game', 'group' and 'room', they are all the same thing here

3. need a routine to check if chosen 'room/group/game' is a valid one, and to error/restart if not

4. Throw players to an error page when they do not allow locations to be grabbed, and inform them how to fix this.
Note that on mobiles the location permission is not 'sticky' when launched from facebook messenger (facebook browser). This is fixed if player launches it in a real browser

5. Clarify all the timeouts - time to refresh player location, refresh room contents and time to remove a player once they shutdown/switch off browser on phone.



## Code Vision -

1. Reward display - secure display and screen pause - of reward information once success criteria is reached

Note - only display the reward to IDs that are currently occupying one of the waypoints

Allow content to be copied for use outside of app




# code logic explained

server.js  
[SERVER.JS](https://github.com/{{ repository.name }}/server.js) : the primary engine (server side javascript creates and runs index.ejs) - no visibility of goings on to enduser (can only be seen in heroku console). Must socket.emit to communicate to client side javascript

public/js/client.js   is the primary controller (client side javascript called from index.ejs) - visible in console (F12). 

views/pages/index.ejs    is the calling script (client side html) to display stuff  - visible in console (F12).




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
