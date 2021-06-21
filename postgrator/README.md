To rebaseline postgrator:
- from the CLI:
```
DROP TABLE player;
DROP TABLE games;
DROP TABLE waypoint;
DROP TABLE schemaversion;
DROP extension PostGIS CASCADE;
```
- Then change the postgrator migration load files to suit new needs, and
- rebuild the app 
