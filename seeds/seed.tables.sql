BEGIN;

TRUNCATE
  "usersProjectCollaboration",
  "bids",
  "projects",
  "users";

INSERT INTO "users" ("id", "username", "email","user_description", "password","image")
VALUES
  (
    1,
    'admin',
    'admin@theateam.com',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  ),
  (
    2,
    'sample_user',
    'sample_user@theateam.com',
    -- password = "pass"
    -- need to implement hashed password
    'pass'
  )

INSERT INTO "projects" ("id", "project_name", "owner_id","project_description")
VALUES
  (1, 'Spaced Repetition', 1,"Need someone to work on the backend.");

INSERT INTO "bids" ("id", "user_id", "project_id", "bid")
VALUES
  (1, 2, 1, 'Bid')

INSERT INTO "usersProjectCollaboration" ("id", "project_id","collaborator_id","position")
VALUES 
  (1,1,2,"First")

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('usersProjectCollaboration_id_seq', (SELECT MAX(id) from "usersProjectCollaboration"));
SELECT setval('bids_id_seq', (SELECT MAX(id) from "bids"));
SELECT setval('projects_id_seq', (SELECT MAX(id) from "projects"));
SELECT setval('users_id_seq', (SELECT MAX(id) from "users"));

COMMIT;
