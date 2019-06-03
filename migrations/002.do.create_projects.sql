CREATE TABLE "projects" (
  "id" SERIAL PRIMARY KEY,
  "owner_id" INTEGER REFERENCES "users"(id),
  "project_name" TEXT NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE,
  "project_description" TEXT NOT NULL,
);