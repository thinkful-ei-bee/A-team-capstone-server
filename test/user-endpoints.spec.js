'use strict';
/* global supertest */
const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Users Endpoints', function() {
  let db;

  const { testUsers, testProjects, testBids } = helpers.makeArrays();
  const alreadyTaken = testUsers[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('POST /api/users', () => {
    context('User Validation', () => {
      beforeEach('insert users', () =>
        helpers.seedUsers(db, testUsers, testProjects, testBids)
      );

      const requiredFields = ['username', 'password', 'email', 'user_description'];

      requiredFields.forEach(field => {
        const registerAttemptBody = {
          username: 'test username',
          password: 'test password1',
          email: 'testemail@noemail.com',
          user_description: 'test description'
        };

        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field];

          return supertest(app)
            .post('/api/users')
            .send(registerAttemptBody)
            .expect(400, {
              error: `Missing '${field}' in request body`,
            });
        });
        
      });
      it('responds with 400 "Password must be at least 8 characters" when password is less than 8 characters long', () => {
        const attempt = {
          username: 'apples',
          password: 'abcdefg',
          email: 'testemail@noemail.com',
          user_description: 'test description'
        };

        return supertest(app)
          .post('/api/users')
          .send(attempt)
          .expect(400,{error: 'Password must be at least 8 characters'});
      });

      it('responds with 400 "Password must be less than 72 characters" when password is more than 71 characters long', () => {
        const attempt = {
          username: 'apples',
          password: 'a'.repeat(72),  
          email: 'testemail@noemail.com',
          user_description: 'test description'
        };

        return supertest(app)
          .post('/api/users')
          .send(attempt)
          .expect(400,{error: 'Password must be less than 72 characters'});
      });

      it('responds with 400 error when password starts with a space', () => {
        const attempt = {
          username: 'apples',
          password: ' aadsi8d!!%%s78dSd',  
          email: 'testemail@noemail.com',
          user_description: 'test description'
        };

        return supertest(app)
          .post('/api/users')
          .send(attempt)
          .expect(400,{error: 'Password must not start or end with a space'});
      });

      it('responds with 400 error when password ends with a space', () => {
        const attempt = {
          username: 'apples',
          password: 'aadsi8d!!%%s78dSd ',
          email: 'testemail@noemail.com',
          user_description: 'test description'
        };

        return supertest(app)
          .post('/api/users')
          .send(attempt)
          .expect(400, {error: 'Password must not start or end with a space'});
      });

      it('responds with 400 error when password does not have both letters and numbers', () => {
        const attempt = {
          user_name: 'apples',
          password: '12345678',
          email: 'testemail@noemail.com',
          user_description: 'test description'
        };

        return supertest(app)
          .post('/api/users')
          .send(attempt)
          .expect(400, { error: 'Password must contain at least one letter and one number'});
      });
      
      it('responds with 400 "Username already taken" when username is already taken', () => {
        const attempt = {
          username: alreadyTaken.username,
          password: 'aadsi8d!!%%s78dSd',
          email: 'testemail@noemail.com',
          user_description: 'test description'
        };

        return supertest(app)
          .post('/api/users')
          .send(attempt)
          .expect(400, {error: 'Username already taken'});
      });
      
      it('responds with 400 "Email already taken" when email is already taken', () => {
        const attempt = {
          username: 'newuserNotTaken',
          password: 'aadsi8d!!%%s78dSd',
          email: alreadyTaken.email,
          user_description: 'nondescript description'
        };

        return supertest(app)
          .post('/api/users')
          .send(attempt)
          .expect(400, {error: 'Email already taken'}); 
      });
    });
  });
});