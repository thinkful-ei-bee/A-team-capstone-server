BEGIN;

ALTER TABLE "usersProjectCollaboration"
DROP CONSTRAINT "usersProjectCollaboration_collaborator_id_fkey";

ALTER TABLE "usersProjectCollaboration"
DROP CONSTRAINT "usersProjectCollaboration_project_id_fkey";

ALTER TABLE "usersProjectCollaboration"
ADD CONSTRAINT "usersProjectCollaboration_collaborator_id_fkey"
FOREIGN KEY (collaborator_id)
REFERENCES users (id)
ON DELETE CASCADE;

ALTER TABLE "usersProjectCollaboration"
ADD CONSTRAINT "usersProjectCollaboration_project_id_fkey"
FOREIGN KEY (project_id)
REFERENCES projects (id)
ON DELETE CASCADE;

COMMIT;