-- --------------------------------------------------------------------------------------------
-- RELEASE GAME GC9JEH6 - a seperate postgrator file per geocache following the below format --
-- --------------------------------------------------------------------------------------------

INSERT INTO
  games (game_code, description, minimum_players, reward)
SELECT
  'GC9JEH6', 'The Anti-Social-Mob cache', 2, 'S27° 28.327 E153° 01.373 : Take a seat and reach behind the bottom outside corner of the metal plate behind you. Small (not micro) sized magnetic thin container';

INSERT INTO
    waypoint (game_code, name, location, radius)
SELECT
    'GC9JEH6', 'Goodwill', 'SRID=3857; POINT(-27.480867  153.026933)', 25;
    
INSERT INTO
    waypoint (game_code, name, location, radius)
SELECT
    'GC9JEH6', 'Kurilpa', 'SRID=3857; POINT( -27.469567  153.017617)', 25;
