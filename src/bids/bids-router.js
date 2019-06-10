'use strict';
const express = require('express');
const BidsService = require('./bids-service.js');
const ProjectsService = require('../projects/projects-service');
const bidsRouter = express.Router();
const jsonBodyParser = express.json();
const {requireAuth} = require('../middleware/jwt-auth');

// get users bids
bidsRouter
  .route('/')
  .all(requireAuth)
  .get(jsonBodyParser, (req,res,next)=>{
    const id = req.user.id;
    BidsService.getBidsByUser(req.app.get('db'),id)
      .then(bids=>{
        return res.json(bids);
      })
      .catch(next);
  })
  .post(jsonBodyParser, (req, res, next) => {
    const newBid = req.body;
    newBid.user_id = req.user.id;

    if (!newBid.bid) {
      return res.status(400).json({
        error: 'Bid content is required'
      });
    }

    if (!newBid.project_id) {
      return res.status(400).json({
        error: 'Project id is required'
      });
    }

    ProjectsService.getAllProjects(req.app.get('db'))
      .then((projectArr) => {
        let projectIds = projectArr.map(project => project.id);
        let userProjects = projectArr.filter(project => project.owner_id === newBid.user_id).map(project => project.id);

        if (projectIds.indexOf(newBid.project_id) === -1) {
          return res.status(400).json({
            error: 'Project does not exist'
          });
        } else if (userProjects.indexOf(newBid.project_id) !== -1) {
          return res.status(400).json({
            error: 'Project belongs to current user'
          });
        } else {
          BidsService.addBid(req.app.get('db'), {
            user_id: newBid.user_id,
            project_id: newBid.project_id,
            bid: newBid.bid
          })
            .then(bid => {return res.status(201).json({
              id: bid.id });})
            .catch(next); 
        }
      });
  });

bidsRouter
  .route('/bid/:id')
  .all(requireAuth)
  .delete((req, res, next) => {
    const user_id = req.user.id;
    const bid_id = req.params.id;
    return BidsService.getBidById(req.app.get('db'), bid_id)
      .then((bid) => {

        return ProjectsService.getAllProjects(req.app.get('db'))
          .then(list => {
            const singleProject = list.filter(ele => ele.id === bid.project_id);
            const owner = singleProject[0].owner_id;

            if (bid.user_id !== user_id && owner !== user_id) {
              return res.status(400).json({error: 'Unauthorized request'});
            }

            return BidsService.removeBid(req.app.get('db') , bid_id)
              .then(() => res.status(204).end());
          });
      })
      .catch(next);
  });
  
bidsRouter
  .route('/others')
  .all(requireAuth)
  .get(jsonBodyParser, (req, res, next) => {
    const id = req.user.id;
    BidsService.getBidsForUserProjects(req.app.get('db'), id)
      .then(bids => res.status(200).json(bids))
      .catch(next);
  });

bidsRouter
  .route('/others/:id')
  .all(requireAuth)
  .get(jsonBodyParser, (req, res, next) => {
    const id = req.user.id;
    BidsService.getBidsForUserProjects(req.app.get('db'), id)
      .then(bids => {
        const singleBid = bids.filter(ele => ele.project_id === Number(req.params.id));
        return res.status(200).json(singleBid);})
      .catch(next);
  });

module.exports = bidsRouter;