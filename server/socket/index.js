import socketIo from 'socket.io';
import cookie from 'cookie';
import config from '../config/config'
import cookieParser from 'cookie-parser';
import sessionStore from '../services/sessionStore';
import Sequelize from 'sequelize';
import db from '../model'

const Op = Sequelize.Op;

export function socketServer (server) {

  const io = socketIo(server);

  io.origins((origin, callback) => {
    if (origin !== `http://localhost:${config.port}/chat`) {
      return callback('origin not allowed', false);
    }
    callback(null, true);
  });

  io.use(function(socket, next) {

    const handshakeData = socket.request;
    const parsedCookie = cookie.parse(handshakeData.headers.cookie || '');
  
    const sid = cookieParser.signedCookie(parsedCookie['sid'],  config.session.secret);

    if (parsedCookie['sid'] === sid) {
      return next(new Error('Not Authenticated'));
    }

    sessionStore.get(sid)
    .then( (session) => {
      if (!session) {
        return next(new Error('Not Authenticated'));
      }
      socket.session = session;
      socket.sid = sid;
      return next();
    });

    // make sure the handshake data looks good as before
    // if error do this:
      // next(new Error('not authorized'));
    // else just call next
  });

  io.use(function(socket, next) {

    db.User
    .findOne({ where: { id: { [Op.eq]: socket.session.user } } })
    .then(user => {
      if (user !== null) {
        socket.user = user;
        next();
      } else {
        next(new Error('Not Authenticated'));
      }
    })
    .catch(err => { 
      throw new Error(err.message)
    })
  });

  io.on('sessionReload', function (sid) {

    let clients = io.sockets.sockets;

    for (let element in clients) {

      const client = clients[element];

      if (client.sid !== sid) continue;

      try {
        sessionStore.get(sid)
        .then( (session) => {
          if (!session) {
            client.emit('logout')
            client.disconnect()
            return;
          }
          client.session = session;
          client.sid = sid;
          return;
      });
      } catch (error) {
        client.emit('error', 'server error')
        client.disconnect()
        return;
      }
    }
  })

  io.on('connection', function (socket) {

    const userName = socket.user.name;

    socket.broadcast.emit('join', userName);

    socket.on('message', function (message, cb) {
      socket.broadcast.emit('message', userName, message);
      cb(userName)
    });

    socket.on('Test', function () {
      socket.emit('testBack', 'message');
    });

    socket.on('disconnect', function () {
      socket.broadcast.emit('leave', userName);
    });

  });

  return io;
}