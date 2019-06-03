BEGIN;

TRUNCATE
  "usersProjectCollaboration",
  "bids",
  "projects",
  "users";

INSERT INTO "users" ("username", "email","user_description", "password","image")
VALUES
  (
    'admin',
    'admin@theateam.com',
    'Professional in React, Node, and Express',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG',
    'https://www.gravatar.com/avatar/HASH'
  ),
  (
    'sample_user',
    'sample_user@theateam.com',
    'Proficent in Node and Express',
    -- password = "pass"
    -- need to implement hashed password
    'pass',
    'https://www.gravatar.com/avatar/HASH'
  );

INSERT INTO "projects" ( "project_name", "owner_id","project_description")
VALUES
  ('Spaced Repetition', 1,'Need someone to work on the backend.');

INSERT INTO "bids" ("user_id", "project_id", "bid")
VALUES
  (2, 1, 'Bid');

INSERT INTO "usersProjectCollaboration" ( "project_id","collaborator_id","position")
VALUES 
  (1,2,'First');


COMMIT;
