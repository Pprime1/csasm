--- Player Table (when players online they have a row in the table)
CREATE TABLE players (
  id 			SERIAL PRIMARY KEY,
  name		 	VARCHAR(30),
  created_at 	TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at 	TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  location 		GEOMETRY(Point, 3857) 
);

-- Update SRID to WGS84 (World Geodetic System 1984) - Standard for most calcluations worldwide
SELECT UpdateGEometrySRID('players', 'location', 3857);

-- Create Trigger for updated column timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- assosicate updated trigger with players table
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON players
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
