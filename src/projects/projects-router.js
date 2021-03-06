'use strict';

const express = require('express');
const { requireAuth } = require('../middleware/jwt-auth');
const projectsRouter = express.Router();
const jsonBodyParser = express.json();
const ProjectsService = require('./projects-service');

projectsRouter
  .route('/')
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
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

    if (!newProject.deadline) {
      newProject.deadline = null;
    }

    if (!newProject.openPositions || newProject.openPositions < 0 || newProject.openPositions > 100 || !Number.isInteger(Number(newProject.openPositions))) {
      return res.status(400).json({error: 'Open positions should be an integer between 0 and 100'});
    }

    return ProjectsService.addProject(req.app.get('db'), newProject)
      .then(project => {return res.status(201).json({
        id: project.id });})
      .catch(next); 
  })
  .get((req, res, next) => {
    ProjectsService.getAllProjects(req.app.get('db'))
      .then(list => {
        return res.status(200).json(ProjectsService.serializeProjects(list));
      })
      .catch(next);
  });

projectsRouter
  .route('/:id')
  .get((req, res, next) => {
    ProjectsService.getProjectsFromId(req.app.get('db'), req.params.id)
      .then(list => {
        return res.status(200).json(ProjectsService.serializeProjects(list));
      })
      .catch(next);
  });
 
module.exports = projectsRouter;