'use strict';
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const { NODE_ENV } = require('./config');

const app = express();
const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';
const authRouter = require('./auth/auth-router');
const usersRouter = require('./users/users-router');
const projectsRouter = require('./projects/projects-router.js');
const profileRouter = require('./profile/profile-router.js');
const bidsRouter = require('./bids/bids-router.js');
const commentsRouter = require('./comments/comments-router');

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/profile', profileRouter);
app.use('/api/bids', bidsRouter);
app.use('/api/comments', commentsRouter);

// eslint-disable-next-line no-unused-vars
app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    // eslint-disable-next-line no-console
    console.error(error);
    response = {message: error.message, error};
  }

  res.status(500).json(response);
});

module.exports = app;