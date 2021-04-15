-- Create ASM table
CREATE TABLE asm (
  --id 			SERIAL PRIMARY KEY,
  --description 	TEXT,
  --created_at 	TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  --location 		GEOMETRY(Point, 3857) NOT NULL
  Gcode VARCHAR(10) PRIMARY KEY,
  Loc1 GEOMETRY(Point,3857) NOT NULL,
  Rad1 INTEGER,
  Time1 TIMESTAMPTZ NOT NULL DEFAULT 0,
  Loc2 GEOMETRY(Point,3857) NOT NULL,
  Rad2 INTEGER,
  Time2 TIMESTAMPTZ NOT NULL DEFAULT 0,
  TxtOut TEXT
);

-- Update SRID to WGS84 (World Geodetic System 1984) - Standard for most calcluations worldwide
SELECT UpdateGeometrySRID('asm', 'loc1', 3857);
SELECT UpdateGeometrySRID('asm', 'loc2', 3857);

-- Insert Game 1
INSERT INTO asm (Gcode,Loc1,Rad1,Loc2,Rad2,TxtOut) 
--SELECT 'Andrews Place', 'SRID=3857; POINT(-27.71451719967375 153.159056940647)';
SELECT 'GCTEST', 'SRID=3857; POINT(-27.34511 153.03048)', 100, 'SRID=3857; POINT(-27.34296 153.01237)', 100, 'You have reached Nirvana';
