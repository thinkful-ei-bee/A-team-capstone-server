'use strict';
const express = require('express');
const BidsService = require('./bids-service.js');
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

    BidsService.addBid(req.app.get('db'), {
      user_id: newBid.user_id,
      project_id: newBid.project_id,
      bid: newBid.bid
    })
      .then(bid => {return res.status(201).json({
        id: bid.id });})
      .catch(next); 
  });

bidsRouter
  .route('/others')
  .all(requireAuth)
  .get(jsonBodyParser, (req, res, next) => {
    const id = req.user.id;
    BidsService.getBidsForUserProjects(req.app.get('db'), id)
      .then(bids => res.status(200).end());// .json(bids))
    //   .catch(next);
    // res.status(200).end();
  });

module.exports = bidsRouter;