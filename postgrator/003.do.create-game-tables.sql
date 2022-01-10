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
