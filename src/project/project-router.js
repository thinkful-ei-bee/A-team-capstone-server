'use strict';

const express = require('express');
const projectRouter = express.Router();
const ProjectsService = require('../projects/projects-service');

projectRouter
  .route('/:id')
  .get((req, res, next) => {
    ProjectsService.getAllProjects(req.app.get('db'))
      .then(list => {
        const singleProject = list.filter(ele => ele.id === Number(req.params.id));
        return res.status(200).json(singleProject);
      })
      .catch(next);
  });
 
module.exports = projectRouter;