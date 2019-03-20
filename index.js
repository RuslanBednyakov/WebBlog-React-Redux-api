import app from './server/config/express';
import config from './server/config/config';
import http from 'http';
import {socketServer} from './server/socket';


// const app = require('./server/config/express');
// const config = require('./server/config/config');

const server = http.Server(app);


server.listen(config.port, () => {
  console.log(`Server listen Port: ${config.port}`);
});

// app.listen(config.port, () => {
//     console.log('Server listen Port: 4000');
//   });

process.on('uncaughtException', (err) => {
  console.log('uncaughtException ', err);
})

const io = socketServer(server);
app.set('io', io);