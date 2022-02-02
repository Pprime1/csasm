 ---
 # PRODUCTION GAMES #
 - GC9JEH6: Brisbane City two bridge waypoints by Pprime (P`)
---
# TEST GAMES #
- GCALPHA: Brisbane city, two bridge waypoints
- GCBETA: Carseldine The Green two waypoints
- GCGAMMA: Carseldine The Green three waypoints

## To rebaseline postgrator: ##
- from the Git CMD prompt:
```
heroku login (and then follow the web screen prompts to login, uses authenticater)
heroku pg:psql -a=csasm (or -a=asmhub for prod)

DROP TABLE player;
DROP TABLE waypoint;
DROP TABLE games CASCADE;
DROP TABLE schemaversion;
DROP extension PostGIS CASCADE;

\q
```
- Then change the postgrator migration load files to suit new needs, and
- rebuild the app 
