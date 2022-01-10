## TEST GAMES ##
- GCALPHA
- GCBETA
- GCGAMMA
 

## To rebaseline postgrator: ##
- from the Git CMD prompt:
```
heroku login (and then follow the web screen prompts to login, uses authenticater)
heroku pg:psql -a=csasm

DROP TABLE player;
DROP TABLE waypoint;
DROP TABLE games CASCADE;
DROP TABLE schemaversion;
DROP extension PostGIS CASCADE;

\q
```
- Then change the postgrator migration load files to suit new needs, and
- rebuild the app 
