'use strict';
const express = require('express');
const ProfileService = require('./profile-service.js');
const profileRouter = express.Router();
const jsonBodyParser = express.json();
const {requireAuth} = require('../middleware/jwt-auth');

// get users profile
profileRouter
  .get('/',requireAuth, jsonBodyParser, (req,res,next)=>{
    console.log(req.user);
    const id = req.user.id;
    ProfileService.getProfile(req.app.get('db'),id)
      .then(profile=>{
        return res.json(profile);
      })
      .catch(next);
  });