  
-- TEST GAME GCALBURY2 - attempting to have a seperate postgrator file per geocache following the below format
-- This 009 file replaces the failed one in 008 that I cannot now get rid of or reuse?

INSERT INTO
  games (game_code, description, minimum_players, reward)
SELECT
  'GCALBURY2', 'The Anti-Social-Mob cache for Albury to Carseldine testing', 2, 'We have a win! Go to Ronnies ;-)';

INSERT INTO
    waypoint (game_code, name, location, radius)
SELECT
    'GCALBURY2', 'Albury', 'SRID=3857; POINT(-36.055217 146.909850)', 150;
    
INSERT INTO
    waypoint (game_code, name, location, radius)
SELECT
    'GCALBURY2', 'Carseldine', 'SRID=3857; POINT(-27.34296 153.01237)', 50;
