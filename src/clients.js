'use strict';
const url = require('url');
const AuthService = require('.//auth/auth-service');

const clients = {
  clientList: [],
  addClient(ws, req) {

    const parsed = url.parse(req.url);
    const project_id = parsed.pathname.slice(1, parsed.pathname.length - 1);
    const token = parsed.query.slice(6);
    const payload = AuthService.verifyJwt(token);
    
    const client = {
      username: payload.sub,
      user_id: payload.user_id,
      project_id: project_id,
      connection: ws
    };

    const temp = [];

    this.clientList.push(client);
    this.clientList.forEach(client => {
      if (client.connection.readyState !== 3) {
        temp.push(client);
      }
    });
    this.clientList = temp;
  }
};

module.exports = clients;
