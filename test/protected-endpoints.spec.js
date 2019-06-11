'use strict';
/* global supertest */
const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Protected endpoints', () => {
  let db;

  const { testUsers, testProjects, testBids } = helpers.makeArrays();

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

  beforeEach('insert users', () => {
    return helpers.seedUsers(db, testUsers, testProjects, testBids);
  });

  const protectEndpoints = [
    {
      name: 'GET /api/bids/',
      path: '/api/bids'
    },
    {
      name: 'GET /api/bids/others',
      path: '/api/bids/others'
    },
    {
      name: 'GET /api/bids/others/:id',
      path: '/api/bids/others/1'
    },
    {
      name: 'GET /api/collaboration',
      path: '/api/collaboration'
    }
  ];

  protectEndpoints.forEach(endpoint => {
    describe(endpoint.name, () => {
      it('responds with 401 \'Missing bearer token\' when no bearer token', () => {
        return supertest(app)
          .get(endpoint.path)
          .expect(401, { error: 'Missing bearer token' });
      });

      it('respond 401 \'Unauthorized request\' when invalid JWT secret', () => {
        const validUser = testUsers[0];
        const invalidSecret = 'bad-secret';
        return supertest(app)
          .get(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
          .expect(401, { error: 'Unauthorized request'});
      });

      it('responds 401 \'Unauthorized request\' when invalid sub in payload', () => {
        const invalidUser = { username: 'fakeuser', id: 1 };
        return supertest(app)
          .get(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(invalidUser))
          .expect(401, { error: 'Unauthorized request' });
      });
    
    });
  });
  describe('GET /api/bids/others/:project_id', () => {
    it('responds 200 but with empty array when project belongs to another user', () => {
      return supertest(app)
        .get('/api/bids/others/4')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(200, []);
    });
  });
});
