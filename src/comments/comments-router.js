'use strict';
const express = require('express');
const CommentsService = require('./comments-service.js');
const CommentsRouter = express.Router();
const jsonBodyParser = express.json();
const {requireAuth} = require('../middleware/jwt-auth');

// get comments on a project
CommentsRouter
  .route('/:project_id')
  .all(requireAuth)
  .get(jsonBodyParser, (req,res,next)=>{
    const id = req.user.id;
    const project_id = Number(req.params.project_id);
    CommentsService.getProjectsOpenForComments(req.app.get('db'),id)
      .then(projectIds => {
        if (projectIds.indexOf(project_id) === -1) {
          return res.status(400).json({error: 'Comments on this project not available to current user'});
        }
        CommentsService.getCommentsByProject(req.app.get('db'), project_id)
          .then(comments => res.status(200).json(comments));
      })
      .catch(next);
  })
  .post(jsonBodyParser, (req, res, next) => {
    const newComment = req.body;
    newComment.author_id = req.user.id;
    newComment.project_id = Number(req.params.project_id);
    
    if (!newComment.content) {
      return res.status(400).json({
        error: 'Comment content is required'
      });
    }

    CommentsService.getProjectsOpenForComments(req.app.get('db'), newComment.author_id)
      .then(projectIds => {
        if (projectIds.indexOf(newComment.project_id) === -1) {
          return res.status(400).json({error: 'Commenting on this project not available to current user'});
        }

        CommentsService.addComment(req.app.get('db'), {
          author_id: newComment.author_id,
          project_id: newComment.project_id,
          content: newComment.content
        })
          .then(comment => res.status(201).json(comment));
      });
  });
module.exports = CommentsRouter;