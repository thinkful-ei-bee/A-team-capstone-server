BEGIN;

UPDATE projects
SET "openForBids" = 'true'
WHERE "openForBids" IS NULL;

ALTER TABLE projects
ALTER "openForBids" SET DEFAULT true;

COMMIT;