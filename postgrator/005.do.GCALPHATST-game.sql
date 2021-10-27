-- --------------------------------------------------------------------------------------------
-- TEST GAME GCALPHATST - a seperate postgrator file per geocache following the below format --
-- --------------------------------------------------------------------------------------------

INSERT INTO
  games (game_code, description, minimum_players, reward)
SELECT
  'GCALPHATST', 'The Anti-Social-Mob cache: Alpha testing', 2, 'VICTORY IS MINE!!! A coffee shall be our reward, where will I meet you? ;-)';

INSERT INTO
    waypoint (game_code, name, location, radius)
SELECT
    'GCALPHATST', 'Goodwill', 'SRID=3857; POINT(-27.480867  153.026933)', 25;
    
INSERT INTO
    waypoint (game_code, name, location, radius)
SELECT
    'GCALPHATST', 'Kurilpa', 'SRID=3857; POINT( -27.469567  153.017617)', 25;
