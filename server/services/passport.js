import jwt from 'jsonwebtoken';
import passport from "passport";
import passportJWT  from "passport-jwt";
import Sequelize from 'sequelize';

import db from '../model';
import config from '../config/config';

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const Op = Sequelize.Op;

let jwtOptions = {}
jwtOptions.jwtFromRequest = function(req){

  let token;
  if(req && !!req.headers['authorization']){
    token = req.headers['authorization'];
  }
  return token;
}

jwtOptions.secretOrKey = config.secret;

passport.use(new JwtStrategy(jwtOptions, function(jwt_payload, done) { 
  db.User
    .findOne({ where: { id: {[Op.eq]: jwt_payload.id}} })
    .then((user) => {
      if (user) {
        return done(null, user.dataValues.id, {message:'Succes authenticate'});
      } else {
        return done(null, false, {status: 401, message:'Unauthorized'});
      }
    })
    .catch(err => {
      if(err) throw err
    })
}));


export default passport;