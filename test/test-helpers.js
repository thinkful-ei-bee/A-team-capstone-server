'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeUsersArray() {
  return [
    {
      id: 1,
      username: 'testuser1',
      password: 'password1',
      email: 'noemail@noemail.com',
      user_description: 'first test user'
    },

    {
      id: 2,
      username: 'testuser2',
      password: 'password2',
      email: 'none@none.com',
      user_description: 'second test user'
    },

    {
      id: 3,
      username: 'testuser3',
      password: 'password3',
      email: 'none@noemail.com',
      user_description: 'third test user'
    }
  ];
}

function makeProjectsArray(users) {
  return [
    {
      id: 1,
      owner_id: users[0].id,
      project_name: 'the first project',
      project_description: 'The project for the first user',
      created_at: '2019-05-02T16:28:32.615Z',
      updated_at: '2019-05-02T16:28:32.615Z'
    },
    {
      id: 2,
      owner_id: users[0].id,
      project_name: 'New Project!',
      project_description: 'A second project for the first user',
      created_at: '2019-05-03T16:29:35.615Z',
      updated_at: '2019-05-03T16:29:35.615Z'
    },
    {
      id: 3,
      owner_id: users[1].id,
      project_name: 'Better project',
      project_description: 'project for second user',
      created_at: '2019-05-04T17:28:37.615Z',
      updated_at: '2019-05-04T17:28:37.615Z'
    },
    {
      id: 4,
      owner_id: users[2].id,
      project_name: 'Third user project',
      project_description: 'Project for third user',
      created_at:'2019-05-04T17:28:37.615Z',
      updated_at: '2019-05-04T17:28:37.615Z'
    }
  ];
}

function makeBidsArray(users, projects) {
  return [
    {
      id: 1,
      user_id: users[0].id,
      project_id: projects[2].id,
      bid: 'x',
      status: 'open'
    },

    {
      id: 2,
      user_id: users[2].id,
      project_id: projects[1].id,
      bid: 'x',
      status: 'open'
    },
    {
      id: 3,
      user_id: users[1].id,
      project_id: projects[3].id,
      bid: 'x',
      status: 'open'
    }
  ];
}

function makeCollaborationArray(users, projects) {
  return [
    {
      project_id: projects[0].id,
      collaborator_id: users[1].id,
      position: 'x'
    }
  ];
}

function makeArrays() {
  const testUsers = makeUsersArray();
  const testProjects = makeProjectsArray(testUsers);
  const testBids = makeBidsArray(testUsers, testProjects);
  const testCollaboration = makeCollaborationArray(testUsers, testProjects);

  return { testUsers, testProjects, testBids, testCollaboration };
}

function seedUsers(db, users, projects, bids, collaboration) {
  
  const preppedUsers = users.map(user => ({
    id: user.id,
    username: user.username,
    password: bcrypt.hashSync(user.password, 1),
    user_description: user.user_description,
    email: user.email
  }));

  return db.into('users').insert(preppedUsers)
    .then(() => {
      return db.raw(
        'SELECT setval(\'users_id_seq\', ?)',
        [users[users.length - 1].id]
      )
        .then(() => {
          return db.into('projects').insert(projects)
            .then(() => {
              return db.raw(
                'SELECT setval(\'projects_id_seq\', ?)',
                [projects[projects.length - 1].id]
              )
                .then(() => {
                  return db.into('bids').insert(bids)
                    .then(() => {
                      return db.raw(
                        'SELECT setval(\'bids_id_seq\', ?)', [bids[bids.length - 1].id]
                      )
                        .then(() => {
                          return db.into('usersProjectCollaboration').insert(collaboration)
                            .then(() => {
                              return; /* db.raw(
                                'SELECT setval("usersProjectCollaboration_id_seq", ?)', [collaboration[collaboration.length - 1].id]
                               ); */
                            });
                        });
                    });
                });
            });
        });
    });
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET){
  const token = jwt.sign({user_id: user.id }, secret, {
    subject: user.username,
    algorithm: 'HS256'
  });
  return `Bearer ${token}`;
}

function cleanTables(db) {
  return db.raw(
    'TRUNCATE users, projects, bids, "usersProjectCollaboration", comments RESTART IDENTITY CASCADE;'
  );
}

module.exports = {
  makeUsersArray,
  makeProjectsArray,
  makeArrays,
  cleanTables,
  seedUsers,
  makeAuthHeader
};