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
      modified_at: '2019-05-03T16:29:35.615Z'
    },
    {
      id: 3,
      owner_id: users[1].id,
      project_name: 'Better project',
      project_description: 'project for second user',
      created_at: '2019-05-04T17:28:37.615Z',
      modified_at: '2019-05-04T17:28:37.615Z'
    }
  ];
}

function makeArrays() {
  const testUsers = makeUsersArray();
  const testProjects = makeProjectsArray(testUsers);

  return { testUsers, testProjects };
}

function seedUsers(db, users, projects) {
  
  const preppedUsers = users.map(user => ({
    id: user.id,
    username: user.username,
    password: bcrypt.hashSync(user.password, 1),
    user_description: user.user_description,
    email: user.email,
    created_at: user.created_at,
    modified_at: user.modified_at
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
              );
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
    'TRUNCATE users, projects, usersProjectCollaboration, bids RESTART IDENTITY CASCADE;'
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