'use strict';
/* global supertest, expect */

const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Collaboration Endpoints', function() {
  let db;
  const { testUsers, testProjects, testBids, testCollaboration } = helpers.makeArrays();
  
  const newCollaboration = {
    project_id: testProjects[3].id,
    collaborator_id: testUsers[1].id,
    position: 'x'
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

  describe('GET /api/collaboration', () => {
    it('responds with 200 and an array of the collaborations pertaining to current user', () => {
      return supertest(app)
        .get('/api/collaboration')
        .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
        .expect(200, [
          {
            collaborator_id: 2,
            id: 1,
            position: 'x',
            project_id: 1,
            project_name: 'the first project'
          }
        ]);
    });
  });

  describe('POST /api/collaboration', () => {
    it('responds with 400 bad request if no project_id is specified', () => {
      return supertest(app)
        .post('/api/collaboration')
        .set('Authorization', helpers.makeAuthHeader(testUsers[2]))
        .send({
          collaborator_id: newCollaboration.collaborator_id,
          position: newCollaboration.position
        })
        .expect(400);
    });

    it('responds with 400 bad request if no collaborator_id is specified', () => {
      return supertest(app)
        .post('/api/collaboration')
        .set('Authorization', helpers.makeAuthHeader(testUsers[2]))
        .send({
          project_id: newCollaboration.project_id,
          position: newCollaboration.position
        })
        .expect(400);
    });

    it('responds with 201 created and new collaboration if request is valid', () => {
      return supertest(app)
        .post('/api/collaboration')
        .set('Authorization', helpers.makeAuthHeader(testUsers[2]))
        .send(newCollaboration)
        .expect(201)
        .expect(res => {
          expect(res.body.id).not.to.be.undefined;
        });
    });
  });

  describe('DELETE /api/collaboration/:collaboration_id', () => {
    it('returns 204 and no content if successful', () => {
      return supertest(app)
        .get('/api/collaboration/')
        .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
        .expect((result) => {
          let id = result.body[0].id;
          return supertest(app)
            .delete(`/api/collaboration/${id}`)
            .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
            .expect(204);
        });
    });
  });
});