'use strict';

const express = require('express');
const { requireAuth } = require('../middleware/jwt-auth');
const projectsRouter = express.Router();
const jsonBodyParser = express.json();
const ProjectsService = require('./projects-service');

projectsRouter
  .route('/')
  .all(requireAuth)
  .post(jsonBodyParser, (req, res, next) => {
    const newProject = req.body;
    newProject.owner_id = req.user.id;

    if (!newProject.project_name) {
      return res.status(400).json({
        error: 'Project name is required'
      });
    }

    if (!newProject.project_description) {
      return res.status(400).json({
        error: 'Project description is required'
      });
    }

    return ProjectsService.addProject(req.app.get('db'), newProject)
      .then(project => {return res.status(200).json({
        id: project.id });})
      .catch(next); 
  })
  .get((req, res, next) => {
    ProjectsService.getProjects(req.app.get('db'), req.user.id)
      .then(list => {
        return res.status(200).json(list);
      })
      .catch(next);
  });

module.exports = projectsRouter;