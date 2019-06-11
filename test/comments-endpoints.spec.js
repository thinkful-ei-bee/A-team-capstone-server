'use strict';
/* global supertest, expect */

const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Comments Endpoints', function() {
  let db;
  const { testUsers, testProjects, testBids, testCollaboration } = helpers.makeArrays();
  
  const newComment = {
    content: 'This is a comment!'
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

  describe('POST /api/comments/:project_id', () => {
    it('responds with 201 and comment id if made by author', () => {
      return supertest(app)
        .post('/api/comments/1')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .send(newComment)
        .expect(201)
        .expect(res => {
          expect(res.body.id).not.to.be.undefined;
        });
    });

    it('responds with 401 if not author or collaborator', () => {
      return supertest(app)
        .post('/api/comments/1')
        .set('Authorization', helpers.makeAuthHeader(testUsers[2]))
        .send(newComment)
        .expect(401);
    });

    it('responds with 201 if made by collaborator', () => {
      return supertest(app)
        .post('/api/comments/1')
        .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
        .send(newComment)
        .expect(201);
    });
  });

  describe('GET /api/comments/:project_id', () => {
    it('responds with 200 and an array of comments if authorized', () => {
      return supertest(app)
        .get('/api/comments/1')
        .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
        .expect(200, []);
    });

    it('responds with 401 if unauthorized', () => {
      return supertest(app)
        .get('/api/comments/1')
        .set('Authorization', helpers.makeAuthHeader(testUsers[2]))
        .expect(401);
    });
  });  
});
