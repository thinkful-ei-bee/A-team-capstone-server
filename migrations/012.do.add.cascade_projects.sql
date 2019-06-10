BEGIN;

ALTER TABLE "projects"
DROP CONSTRAINT "projects_owner_id_fkey";

ALTER TABLE "projects"
ADD CONSTRAINT "projects_owner_id_fkey"
FOREIGN KEY (owner_id)
REFERENCES users (id)
ON DELETE CASCADE;

COMMIT;

