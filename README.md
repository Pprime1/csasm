# csasm
This is the source code repository for the Geocaching Anti-Social Mob application (ASM) - aka Covid Safe Anti-Social Mob (csasm).
The app runs on multiple mobile devices, each connecting to the same source to determine if they are within a proximity radius of any waypoint location stored in a database table for a given Game-Code.
If so, returns hidden REWARD text value (clues/directions to the final container). Otherwise restart the process (polling) to see if anything has changed.


# TODO

## 1. Clean Up Code -

Issues to be resolved - 
1. no idea how to update the database to insert a new game

2. need to merge the concepts of 'game', 'group' and 'room', they are all the same thing here

3. need a routine to check if chosen 'room/group/game' is a valid one, and to error/restart if not

4. Main display banner/footer (and table???) do not resize on smaller/mobile screens

5. Throw players to an error page when they do not allow locations to be grabbed, and inform them how to fix this

6. Clarify all the timeouts - time to refresh player location, refresh room contents and time to remove a player once they shutdown/switch off browser on phone.

7. Secure display - and screen pause - of reward information once success criteria is reached


# code logic explained

server.js    is the primary engine (server side javascript creates and runs index.ejs) - no visibility of goings on to enduser (can only be seen in heroku console). Must socket.emit to communicate to client side javascript

public/js/client.js   is the primary controller (client side javascript called from index.ejs) - visible in console (F12). 

views/pages/index.ejs    is the calling script (client side html) to display stuff  - visible in console (F12).




## Running Locally 
... unreliable still. code doesn't stay in sync with github?

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

### Documentation

For more information about using Node.js on Heroku, see these Dev Center articles:

- [Getting Started on Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
- [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)
