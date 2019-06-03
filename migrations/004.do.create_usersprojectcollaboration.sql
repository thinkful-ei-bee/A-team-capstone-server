CREATE TABLE "usersProjectCollaboration" (
  "id" SERIAL PRIMARY KEY,
  "project_id" INTEGER REFERENCES "projects"(id),
  "collaborator_id" INTEGER REFERENCES "users"(id),
  "position" TEXT NOT NULL, 
);