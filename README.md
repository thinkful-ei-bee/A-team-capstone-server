# BidHub Server

## Authors

### Eddie Bueno
### David Bolin
### Quonn Bernard

## Summary

This is the server side for our BidHub web app. The source for the client is located [here](https://github.com/thinkful-ei-bee/A-team-capstone) and the app is live [here](https://bidhub.now.sh/).

## API documentation

The API is located at [https://thinkful-final-capstone.herokuapp.com] and has the following endpoints:  

### POST /api/auth/login

Requires a body with "username" and "password." The server returns "authToken," a jwt token, if login is successful, and returns an appropriate error message otherwise.

### POST /api/auth/refresh

Requires a jwt token and returns a refreshed one.

### POST /api/users

Creates a new user. This route takes a body with the following fields:

password: (string, required). Must contain both letters and numbers.
username: (string, required). New username.
image: (string, optional). Url for user avatar; not implemented in current client.
email: (string, required). User's email address.
user_decription: (string, required). User's self description.

Returns 201 with username and new user id if request is successful, otherwise 400 with an appropriate error message.

### POST /api/projects

Creates a new project owned by current user. This takes the following fields:

project_name: (string, required). Name of the new project.
project_description: (string, required). Description of project.
languages: (string, optional). Languages used by the project.
requirements: (string, optional). Minimum requirements for participation.
deadline: (date, optional). Deadline for bids.
openPositions: (integer, optional). Number of positions desired.
openForBids: (Boolean, default value of true). Whether or not the project is currently open for bids.

If successful this returns a status of 201 and the id of the new project.

### GET /api/projects

Returns an array of all current projects. Each project has all of the fields listed above in the route for creating a project, as well as "id" (integer), "owner_id" (integer), and "created_at" (date).

### GET /api/projects/:user_id

Returns an array of all projects belonging to the user with an id of user_id.

### GET /api/profile

Returns the following profile fields for the current user:

id (integer)
username (string)
user_description (string)
image (string, url for avatar; not implemented in current client)

### GET /api/bids

Returns the bids by the current user, with the following fields:

id (integer, id for the bid)
project_id (integer, project which is being bid on)
bid (string, typically empty in current implementation but could be used as a message)
status (string, bid status, should be 'open', 'accepted', or 'declined')

It additionally returns the following fields from the project being bid on:

project_name (string)
project_description (string)
languages (string)
requirements (string)
deadline (date)
openPositions (integer)

### POST /api/bids

This posts a new bid by the current user. Requires the fields project_id (integer, project being bid on) and 'bid', a string, required but typically "null" in the current implementaton.

### DELETE /api/bids/:bid_id

Removes the bid with the id of bid_id if owned by current user, otherwise returns 401 unauthorized.

### GET /api/bids/others

Returns a list of bids by other users on current user's projects. Returns the following fields:

id (number, bid id)
user_id (number, id of bidder)
project_id (number, id of project being bid on)
status (string, bid status, "open", "accepted", or "declined")

Additionally it returns the following fields from the bidding user:

username (string)
user_description (string)
image (string, url for avatar)

### GET /api/bids/others/:project_id

Returns list of bids by other users on specific project with the id project_id, with the fields as above.

### PATCH /api/bids/others/:bid_id

Declines a bid using its specific id. No other information needs to be sent. Accepting a bid uses the collaboration route as explained below.

### GET /api/comments/:project_id

This route is only available to the owner of a project and to collaborators. Returns a list of comments for the project with project_id, with the following fields:

id (integer, comment id)
author_id (integer, user id of comment author)
project_id (integer, should always be the same as project_id requested)
date_created (date created)
content (string, comment content)
username (string, username of comment author)

### POST /api/comments/:project_id

For posting a comment on the project with project_id. This route is only open to owners and collaborators, and requires the single field of "content" with comment content.

Returns the full comment with the fields as given above in the GET route. 

The server also uses WebSockets to notify clients connected to the project page that the comments for this project have been updated.

### GET /api/project/:project_id

Returns the single project with the id of project_id. Fields are as listed above in GET and POST for /api/projects.

### DELETE /api/project/:project_id

Removes the project with project_id. Must be owned by the current user.

### PATCH /api/project/:project_id

Updates the project with project_id. Can take any fields from POST /api/projects.

### GET /api/collaboration

Returns a list of collaborations by current user, with these fields:

id (integer, id for the specific collaboration)
collaborator_id (integer, should always be the current user id)
project_id (integer, id of project)
project_name (string, project name)
position (string, assigned position as collaborator)

### POST /api/collaboration

Creates a new collaboration. Requires the existence of a current bid on a user project. Takes the following fields:

project_id (integer, project where collaboration is being accepted)
collaborator_id (integer, user id of new collaborator). This user must have a bid on this project.
position (string, position assigned)

### GET /api/collaboration/:project_id

Returns collaborations on project with project_id. Current user must be the owner of the project. Returns the following fields:

id (integer, collaboration id)
project_id (integer, should always be the project id requested)
collaborator_id (integer, user id of collaborator)
position (string, collaborator's assigned position)
username (string, collaborator's username)
user_description (string, collaborator's user description)
image (string, avatar url for collaborator)

### DELETE /api/collaboration/:collaboration_id

Removes a collaboration using its specific id. Must be owner or collaborator on the project.

## Development Installation

1. Clone the project and npm install
2. Create a .env file in the root directory with the following environmental variables:

NODE_ENV=development
PORT=8000 (or your preferred port)
MIGRATION_DB_HOST=127.0.0.1
MIGRATION_DB_PORT=5432
MIGRATION_DB_NAME=(name of the database that you will create for this project)
MIGRATION_DB_USER=(username for your database)
MIGRATION_DB_PASS=(password for this user)
DATABASE_URL="postgresql://postgres:(password)@localhost/(database name)"
TEST_DB_URL="postgresql://postgres:(password)@localhost/(test database name)"
JWT_SECRET=(whatever you want)
JWT_EXPIRY="10h" (or some other preferred expiration)

3. Create a database and user corresponding to the above information
4. Run "npm run migrate" to set up the newly created database
5. "npm run dev" will run nodemon, "npm start" will start the server normally.

## Tech 

The project uses a JavaScript Express server with a PostgreSQL database. We also used WebSockets to allow clients to be notified about comment updates by other users without the need for refreshing the page. 