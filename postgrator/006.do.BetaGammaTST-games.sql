-- --------------------------------------------------------------------------------------------
-- TEST GAME GCBETATST - a seperate postgrator file per geocache following the below format --
-- --------------------------------------------------------------------------------------------

INSERT INTO
  games (game_code, description, minimum_players, reward)
SELECT
  'GCBETATST', 'The Anti-Social-Mob cache: Beta test', 2, 'BETA TEST SUCCESS. Gimme a B, gimme a E gimme a T gimma a A - BETA!';

INSERT INTO
    waypoint (game_code, name, location, radius)
SELECT
    'GCBETATST', 'Beta One', 'SRID=3857; POINT( -27.351467 153.0295)', 10;
    
INSERT INTO
    waypoint (game_code, name, location, radius)
SELECT
    'GCBETATST', 'Beta Two', 'SRID=3857; POINT(  -27.35215  153.029367)', 10;
    
-- --------------------------------------------------------------------------------------------
-- TEST GAME GCGAMMATST - a seperate postgrator file per geocache following the below format --
-- --------------------------------------------------------------------------------------------

INSERT INTO
  games (game_code, description, minimum_players, reward)
SELECT
  'GCGAMMATST', 'The Anti-Social-Mob cache: Gamma test', 3, 'A cuatro ... GAMMA TEST SUCCESS. Be the cache, see the cache, hold the cache - GAMMA GAMMA GAMMA!';

INSERT INTO
    waypoint (game_code, name, location, radius)
SELECT
    'GCGAMMATST', 'Gamma Uno', 'SRID=3857; POINT( -27.3511  153.0278)', 10;
    
INSERT INTO
    waypoint (game_code, name, location, radius)
SELECT
    'GCGAMMATST', 'Gamma Dos', 'SRID=3857; POINT( -27.351833  153.027667)', 10;
    
INSERT INTO
    waypoint (game_code, name, location, radius)
SELECT
    'GCGAMMATST', 'Gamma Tres', 'SRID=3857; POINT( -27.351517  153.028267)', 10;
