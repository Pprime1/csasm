CREATE TABLE player (
  id 			VARCHAR(20) PRIMARY KEY,
  updated_at 	TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  location 		GEOMETRY(Point, 3857)
);

-- Update SRID to WGS84 (World Geodetic System 1984) - Standard for most calcluations worldwide
SELECT UpdateGEometrySRID('player', 'location', 3857);

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
BEFORE UPDATE ON player
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
