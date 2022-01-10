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


-- --------------------------------------------------------------------------------------------
-- TEST GAME GCBETATST - a seperate postgrator file per geocache following the below format --
-- --------------------------------------------------------------------------------------------

INSERT INTO
  games (game_code, description, minimum_players, reward)
SELECT
  'GCBETA', 'The Anti-Social-Mob cache: Beta test', 2, 'BETA TEST SUCCESS. Gimme a B, gimme a E gimme a T gimma a A - BETA!';

INSERT INTO
    waypoint (game_code, name, location, radius)
SELECT
    'GCBETA', 'Beta One', 'SRID=3857; POINT(-27.35065 153.029383)', 10;
    
INSERT INTO
    waypoint (game_code, name, location, radius)
SELECT
    'GCBETA', 'Beta Two', 'SRID=3857; POINT(-27.351167 153.029733)', 10;
    
    
-- --------------------------------------------------------------------------------------------
-- TEST GAME GCGAMMATST - a seperate postgrator file per geocache following the below format --
-- --------------------------------------------------------------------------------------------

INSERT INTO
  games (game_code, description, minimum_players, reward)
SELECT
  'GCGAMMA', 'The Anti-Social-Mob cache: Gamma test', 3, 'A cuatro ... GAMMA TEST SUCCESS. Be the cache, see the cache, hold the cache - GAMMA GAMMA GAMMA!';

INSERT INTO
    waypoint (game_code, name, location, radius)
SELECT
    'GCGAMMA', 'Gamma Uno', 'SRID=3857; POINT(-27.3509 153.02875)', 10;
    
INSERT INTO
    waypoint (game_code, name, location, radius)
SELECT
    'GCGAMMA', 'Gamma Dos', 'SRID=3857; POINT(-27.3505 153.028133)', 10;
    
INSERT INTO
    waypoint (game_code, name, location, radius)
SELECT
    'GCGAMMA', 'Gamma Tres', 'SRID=3857; POINT(-27.350867 153.027767)', 10;
