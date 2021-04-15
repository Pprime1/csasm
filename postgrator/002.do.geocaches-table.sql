-- Create Geocache table
CREATE TABLE geocaches (
  id 			SERIAL PRIMARY KEY,
  description 	TEXT,
  created_at 	TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  location 		GEOMETRY(Point, 3857) NOT NULL
);

-- Update SRID to WGS84 (World Geodetic System 1984) - Standard for most calcluations worldwide
SELECT UpdateGEometrySRID('geocaches', 'location', 3857);

-- Insert Example Geocache
INSERT INTO geocaches (description, location) 
SELECT 'Andrews Place', 'SRID=3857; POINT(-27.71451719967375 153.159056940647)';