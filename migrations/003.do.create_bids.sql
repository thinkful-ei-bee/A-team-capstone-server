CREATE TABLE "bids" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER REFERENCES "users"(id),
  "project_id" INTEGER REFERENCES "projects"(id),
  "bid" TEXT NOT NULL
);