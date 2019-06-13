'use strict';
/* global supertest, expect */

const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Bids Endpoints', function() {
  let db;
  const { testUsers, testProjects, testBids, testCollaboration } = helpers.makeArrays();
  
  const newBid = {
    project_id: testProjects[3].id,
    bid: 'x',
  };

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
    return helpers.seedUsers(db, testUsers, testProjects, testBids, testCollaboration);
  });

  describe('GET /api/bids', () => {
    it('responds with 200 and an array of the bids made by current user', () => {
      return supertest(app)
        .get('/api/bids')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(200, [
          {
            id: 1,
            project_id: 3,
            bid: 'x',
            project_name: 'Better project',
            project_description: 'project for second user',
            languages: null,
            requirements: null,
            deadline: null,
            openPositions: null,
            status: 'open'
          }
        ]);
    });
  });

  describe('GET /api/bids/others', () => {
    it('responds with 200 and an array of the bids made by others on user projects', () => {
      return supertest(app)
        .get('/api/bids/others')
        .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
        .expect(200, [
          {
            id: 1,
            project_id: 3,
            bid: 'x',
            image: null,
            status: 'open',
            user_description: 'first test user',
            user_id: 1,
            username: 'testuser1'
          }
        ]);
    });
  });

  describe('POST /api/bids', () => {
    it('responds with 400 bad request if no project_id is specified', () => {
      return supertest(app)
        .post('/api/bids')
        .set('Authorization', helpers.makeAuthHeader(testUsers[2]))
        .send({
          bid: newBid.bid
        })
        .expect(400);
    });

    it('responds with 400 bad request if no bid text is specified', () => {
      return supertest(app)
        .post('/api/bids')
        .set('Authorization', helpers.makeAuthHeader(testUsers[2]))
        .send({
          project_id: newBid.project_id,
        })
        .expect(400);
    });

    it('responds with 201 created and new bid id if request is valid', () => {
      return supertest(app)
        .post('/api/bids')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .send(newBid)
        .expect(201)
        .expect(res => {
          expect(res.body.id).not.to.be.undefined;
        });
    });
  });

  describe('DELETE /api/bids/bid/:bid_id', () => {
    it('returns 204 and no content if successful', () => {
      return supertest(app)
        .delete(`/api/bids/bid/${testBids[0].id}`)
        .set('Authorization', helpers.makeAuthHeader(testUsers[testBids[0].user_id - 1]))
        .expect(204);
    });

    it('returns 401 if user is not author of bid', () => {
      return supertest(app)
        .delete(`/api/bids/bid/${testBids[0].id}`)
        .set('Authorization', helpers.makeAuthHeader(testUsers[2]))
        .expect(401);
    });
  });
});
