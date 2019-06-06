'use strict';
const express = require('express');
const BidsService = require('./bids-service.js');
const bidsRouter = express.Router();
const jsonBodyParser = express.json();
const {requireAuth} = require('../middleware/jwt-auth');

// get users bids
bidsRouter
  .route('/')
  .get(requireAuth, jsonBodyParser, (req,res,next)=>{
    const id = req.user.id;
    BidsService.getBidsByUser(req.app.get('db'),id)
      .then(bids=>{
        return res.json(bids);
      })
      .catch(next);
  })
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
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

    return BidsService.addBid(req.app.get('db'), {
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
  .get(requireAuth, jsonBodyParser, (req, res, next) => {
    const id = req.user.id;
    return BidsService.getBidsForUserProjects(req.app.get('b'))
  });

module.exports = bidsRouter;