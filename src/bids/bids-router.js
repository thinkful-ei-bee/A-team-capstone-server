'use strict';
const express = require('express');
const BidsService = require('./bids-service.js');
const bidsRouter = express.Router();
const jsonBodyParser = express.json();
const {requireAuth} = require('../middleware/jwt-auth');

// get users bids
bidsRouter
  .route('/users/bids')
  .get(requireAuth, jsonBodyParser, (req,res,next)=>{
    const id = req.user.id;
    BidsService.getBidsByUser(req.app.get('db'),id)
      .then(bids=>{
        return res.json(bids);
      })
      .catch(next);
  });

module.exports = bidsRouter;