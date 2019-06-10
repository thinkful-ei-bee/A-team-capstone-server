BEGIN;

ALTER TABLE "bids"
DROP CONSTRAINT "bids_user_id_fkey";

ALTER TABLE "bids"
DROP CONSTRAINT "bids_project_id_fkey";

ALTER TABLE "bids"
ADD CONSTRAINT "bids_project_id_fkey"
FOREIGN KEY (project_id)
REFERENCES projects (id)
ON DELETE CASCADE;

ALTER TABLE "bids"
ADD CONSTRAINT "bids_user_id_fkey"
FOREIGN KEY (user_id)
REFERENCES users (id)
ON DELETE CASCADE;

COMMIT;