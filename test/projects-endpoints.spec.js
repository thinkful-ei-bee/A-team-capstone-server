'use strict';
/* global supertest, expect */

const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Projects Endpoints', function() {
  let db;
  const { testUsers, testProjects, testBids, testCollaboration } = helpers.makeArrays();
  
  const newProject = {
    project_name: 'a very new project!',
    project_description: 'testing a new project',
    languages: 'html',
    requirements: '1 year',
    openPositions: 1,
    openForBids: true
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

  describe('GET /api/projects', () => {
    it('responds with 200 and an array of the projects', () => {
      return supertest(app)
        .get('/api/projects')
        .expect(200)
        .expect(res => {
          expect(res.length !== 0);
        });
    });
  });

  describe('GET /api/project/:id', () => {
    it('responds with 200 and the project with :id', () => {
      return supertest(app)
        .get('/api/project/1')
        .expect(200)
        .expect(res => {
          expect (res.length === 1);
        });
    });
  });

  describe('PATCH /api/project/:id', () => {
    it('responds with 204 if successfully patched', () => {
      return supertest(app)
        .patch('/api/project/1')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .send({openForBids: false})
        .expect(204);
    });
  });

  describe('POST /api/projects', () => {
    it('responds with 400 bad request if no project name is specified', () => {
      return supertest(app)
        .post('/api/projects')
        .set('Authorization', helpers.makeAuthHeader(testUsers[2]))
        .send({
          project_description: newProject.project_description
        })
        .expect(400);
    });

    it('responds with 201 created if request is valid', () => {
      return supertest(app)
        .post('/api/projects')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .send(newProject)
        .expect(201)
        .expect(res => {
          expect(res.body.id).not.to.be.undefined;
        });
    });
  });
});
