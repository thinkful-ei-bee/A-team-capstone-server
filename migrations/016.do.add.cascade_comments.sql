BEGIN;

ALTER TABLE "comments"
DROP CONSTRAINT "comments_author_id_fkey";

ALTER TABLE "comments"
DROP CONSTRAINT "comments_project_id_fkey";

ALTER TABLE "comments"
ADD CONSTRAINT "comments_author_id_fkey"
FOREIGN KEY (author_id)
REFERENCES users (id)
ON DELETE CASCADE;

ALTER TABLE "comments"
ADD CONSTRAINT "comments_project_id_fkey"
FOREIGN KEY (project_id)
REFERENCES projects (id)
ON DELETE CASCADE;

COMMIT;