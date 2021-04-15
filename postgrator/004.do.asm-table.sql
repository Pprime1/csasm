
-- Create ASM table
CREATE TABLE asm (
  --id 			SERIAL PRIMARY KEY,
  --description 	TEXT,
  --created_at 	TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  --location 		GEOMETRY(Point, 3857) NOT NULL
  GCODE varchar(10) Primary key,
  Loc1 geometry(Point,3857) not null,
  Rad1 integer,
  Time1 timestampz not null default 0,
  Loc2 geometry(Point,3857) not null,
  Rad2 integer,
  Time2 timestampz not null default 0,
  TxtOut text
);

-- Update SRID to WGS84 (World Geodetic System 1984) - Standard for most calcluations worldwide
SELECT UpdateGEometrySRID('asm', 'loc1', 3857);
SELECT UpdateGEometrySRID('asm', 'loc2', 3857);

-- Insert Game 1
INSERT INTO asm (GCODE,Loc1,Rad1,Loc2,Rad2,TxtOut) 
--SELECT 'Andrews Place', 'SRID=3857; POINT(-27.71451719967375 153.159056940647)';
SELECT 'GCTEST', 'SRID=3857; POINT(-27.34511 153.03048)', 100, 'SRID=3857; POINT(-27.34296 153.01237)', 100, 'You have reached Nirvana';