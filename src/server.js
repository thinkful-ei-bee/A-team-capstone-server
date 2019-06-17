'use strict';
const knex = require('knex');
const app = require('./app');
const http = require('http');
const clients = require('./clients');
const { PORT, DATABASE_URL } = require('./config');
const server = http.createServer(app);
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
  clients.addClient(ws, req);

  ws.on('message', message => {
    console.log('received: %s', message);
    ws.send(`Hello, you sent -> ${message}`);
    clients.clientList.forEach(ele => console.log(ele.username));
  });

  ws.send('Hi there, I am a WebSocket server');

  ws.on('close', () => {
    console.log('closed connection');
  });
});

const db = knex({
  client: 'pg',
  connection: DATABASE_URL
});

app.set('db', db);

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening at http://localhost:${PORT}`);
});
