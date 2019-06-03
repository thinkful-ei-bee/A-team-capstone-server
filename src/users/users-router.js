'use strict';
const express = require('express');
const UsersService = require('./users-service');
const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter
  .post('/', jsonBodyParser, (req, res, next) => {
    const { password, username, image, email, user_description } = req.body;
    
    const passwordError = UsersService.validatePassword(password);

    if (passwordError) {
      return res.status(400).json({error: passwordError});
    }

    if (!username) {
      return res.status(400).json({error: 'Missing \'username\' in request body'});
    }

    if (!email) {
      return res.status(400).json({error: 'Missing \'email\' in request body'});
    }

    if (!user_description) {
      return res.status(400).json({error: 'Missing \'user_description\' in request body'});
    }

    UsersService.hasUserWithUserName(req.app.get('db'), username)
      .then(hasUserWithUserName => {
        if (hasUserWithUserName) {
          return res.status(400).json({error: 'Username already taken'});
        }

        return UsersService.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
              username,
              password: hashedPassword,
              image,
              user_description
            };

            return UsersService.addUser(req.app.get('db'), newUser)
              .then((user) => {
                return res.status(201).json({
                  username: username,
                  id: user.id
                });
              });
          });      
      })
      .catch(next);
  });

module.exports = usersRouter;