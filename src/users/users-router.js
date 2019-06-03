'use strict';
const express = require('express');
const UsersService = require('./users-service');
const AuthService = require('../auth/auth-service');
const usersRouter = express.Router();
const jsonBodyParser = express.json();

const requireAuth = require('../middleware/jwt-auth').requireAuth;

usersRouter
  .post('/', jsonBodyParser, (req, res, next) => {
    const { password, username, email, user_description, image } = req.body;
    
    const passwordError = UsersService.validatePassword(password);

    if (passwordError) {
      return res.status(400).json({error: passwordError});
    }

    if (!username) {
      return res.status(400).json({error: 'Missing \'username\' in request body'});
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
              hashed_password: hashedPassword,
            };

  
            return UsersService.addUser(req.app.get('db'), newUser)
              .then((user) => {
                        return res.status(201).json({
                          username: username,
                          homepage: page.id
                        });
                      });
                  });      
              });    
          })
      .catch(next);
  });

  // if client sends a "GET" request to /api/users with a JWT token they will get back their username and home page id
  .get('/', requireAuth, (req, res, next) => {
    const authToken = req.get('Authorization');
    const bearerToken = authToken.slice(7, authToken.length);
    
    return AuthService.whoamI(req.app.get('db'), bearerToken)
      .then(user => res.status(200).json(user))
      .catch(next);
  });


module.exports = usersRouter;