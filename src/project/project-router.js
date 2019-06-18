'use strict';

const express = require('express');
const projectRouter = express.Router();
const jsonBodyParser = express.json();
const ProjectsService = require('../projects/projects-service');
const { requireAuth } = require('../middleware/jwt-auth');

projectRouter
  .route('/:id')
  .get((req, res, next) => {
    ProjectsService.getAllProjects(req.app.get('db'))
      .then(list => {
        const singleProject = list.filter(ele => ele.id === Number(req.params.id));
        return res.status(200).json(ProjectsService.serializeProjects(singleProject));
      })
      .catch(next);
  })
  .patch(requireAuth, jsonBodyParser, (req, res, next) => {
    const project_id = Number(req.params.id);
    const user_id = req.user.id;

    ProjectsService.getAllProjects(req.app.get('db'))
      .then(list => {
        const singleProject = list.filter(ele => ele.id === Number(req.params.id));

        if (!singleProject.length) {
          return res.status(404).json({error: 'Project does not exist'});
        }

        const oldProject = singleProject[0];

        if (oldProject.owner_id !== user_id) {
          return res.status(401).json({error: 'Project does not belong to current user'});
        } 

        const newProject = req.body;
        newProject.id = project_id;
        newProject.owner_id = user_id;
        newProject.updated_at = new Date();

        ProjectsService.updateProject(req.app.get('db'), project_id, newProject)
          .then (() => {
            return res.status(204).end();
          });
      })
      .catch(next);
  });
 
module.exports = projectRouter;