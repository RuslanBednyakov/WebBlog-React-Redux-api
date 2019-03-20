import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

// import config from './config'
import passport from '../services/passport';
// import session from 'express-session';
// import sessionStore from '../services/sessionStore';
// import {loadUser} from '../services/loadUser'
import * as customErrors from '../error'
import router from '../routes';


const app = express();

// Enable CORS with various options
// https://github.com/expressjs/cors
app.use(cors());

app.use(cookieParser());

app.use(passport.initialize())

// // Parse incoming request bodies
// // https://github.com/expressjs/body-parser
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(bodyParser.raw({ type: 'application/yaml' }));

//Using custom metod 'res.sendHttpError' to send HttpError
app.use(require('../middleware/sendHttpError'));

// // Using Sessions for Authorisation
// app.use(session({
//   secret: config.session.secret,
//   name: config.session.name,
//   cookie: config.session.cookie,
//   store: sessionStore,
//   resave: false,
//   saveUninitialized: config.session.saveUninitialized
// }))

// sessionStore.sync();



// app.use(loadUser);


// app.use('/', router);
app.use('/', express.static('./public'));
app.use('/api/v1', router.unprotected);
app.use('/api/v1', passport.authenticate('jwt', { session: false }), router.protected);


app.use(function(error, req, res, next) {
  if(typeof error == 'number') {
    error = new customErrors.HttpError(error);
  }
  if(error instanceof customErrors.HttpError) {
    res.sendHttpError(error);
  } else {
    // Development error handler
    // Displays stacktrace to the user
    if (app.get('env') === 'development') {
    res.status(error.status || 500);
    console.log('Error from middleware', error);
    res.send({message: error.message, error});
    };
    // Production error handler
    // Does not display stacktrace to the user
    res.status(err.status || 500);
    res.send(err);
  }
});

export default app;