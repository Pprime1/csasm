-- TEST GAME GCALBURY - attempting to have a seperate postgrator file per geocache following the below format
INSERT INTO
  games (game_code, description, minimum_players, reward)
SELECT
  'GCALBURY', 'The Anti-Social-Mob cache for Albury to Carseldine testing', 2, 'We have a win! Go to Ronnies ;-)';

INSERT INTO
    waypoint (game_code, name, location, radius)
SELECT
    'GCALBURY', 'Albury', 'SRID=3857; POINT(-36.05412 146.91021)', 150;
    
INSERT INTO
    waypoint (game_code, name, location, radius)
SELECT
    'GCALBURY', 'Carseldine', 'SRID=3857; POINT(-27.34296 153.01237)', 50;
