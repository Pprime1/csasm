CREATE TABLE games (
  game_code       VARCHAR(10) NOT NULL PRIMARY KEY,
  description     TEXT,
  minimum_players INTEGER,
  reward          TEXT
);

CREATE TABLE waypoint (
  waypoint_id   SERIAL,
  game_code     VARCHAR(10) REFERENCES games (game_code) ON DELETE CASCADE,
  name          VARCHAR(30),
  location      GEOMETRY(Point, 3857),
  radius        INTEGER,
  PRIMARY KEY (waypoint_id, game_code)
);

-- Update SRID to WGS84 (World Geodetic System 1984) - Standard for most calcluations worldwide
SELECT UpdateGEometrySRID('waypoint', 'location', 3857);



-- ---------------------------------------------------------------------------------------------
--  TEST GAME GCTEST - create a seperate postgrator file per geocache following the below format
-- ---------------------------------------------------------------------------------------------
INSERT INTO
  games (game_code, description, minimum_players, reward)
SELECT
  'GCTEST', 'An exciting Adventure to the test ASM cache that this is', 2, 'You have reached Nirvana and this is the reward data';

INSERT INTO
    waypoint (game_code, name, location, radius)
SELECT
    'GCTEST', 'Waypoiint 1', 'SRID=3857; POINT(-27.27917 152.97558)', 150;

INSERT INTO
    waypoint (game_code, name, location, radius)
SELECT
    'GCTEST', 'Waypoiint 2', 'SRID=3857; POINT(-27.34296 153.01237)', 150;
