'use strict';
const express = require('express');
const CollaborationService = require('./collaboration-service.js');
const ProjectsService = require('../projects/projects-service');
const BidsService = require('../bids/bids-service');
const collaborationRouter = express.Router();
const jsonBodyParser = express.json();
const {requireAuth} = require('../middleware/jwt-auth');

collaborationRouter
  .route('/')
  .all(requireAuth)
  .get(jsonBodyParser, (req,res,next) => {
    const id = req.user.id;

    CollaborationService.getCollaborationsByUser(req.app.get('db'), id)
      .then(coll => {
        return res.json(coll);
      })
      .catch(next);
  })
  .post(jsonBodyParser, (req, res, next) => {
    const newCollaboration = req.body;
    const id = req.user.id;

    if (!newCollaboration.project_id) {
      return res.status(400).json({
        error: 'Project id is required'
      });
    }

    if (!newCollaboration.collaborator_id) {
      return res.status(400).json({
        error: 'Collaborator id is required'
      });
    }

    ProjectsService.getProjectsFromId(req.app.get('db'), id)
      .then((projectArr) => {
        let userProjects = projectArr.filter(project => project.owner_id === id).map(project => project.id);

        if (userProjects.indexOf(newCollaboration.project_id) === -1) {
          return res.status(400).json({
            error: 'Project does not exist or does not belong to current user'
          });   
        }

        BidsService.getBidsByProject(req.app.get('db'), newCollaboration.project_id)
          .then(bids => {
            const bid = bids.filter(ele => ele.user_id === newCollaboration.collaborator_id);
              
            if (bid.length === 0) {
              return res.status(400).json({
                error: 'no corresponding bid for this collaboration'
              });
            }

            const bidId = bid[0].id;

            CollaborationService.addCollaboration(req.app.get('db'), newCollaboration)
              .then(coll => {
                BidsService.removeBid(req.app.get('db'), bidId)
                  .then(() => res.status(201).json(coll));
              })
              .catch(next); 
                
          }
          );          
      });
  });


module.exports = collaborationRouter;