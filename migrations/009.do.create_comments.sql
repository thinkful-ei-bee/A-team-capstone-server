CREATE TABLE "comments" (
  "id" SERIAL PRIMARY KEY,
  "author_id" INTEGER REFERENCES "users"(id),
  "project_id" INTEGER REFERENCES "projects"(id),
  "date_created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "content" TEXT NOT NULL
);