import Sequelize from 'sequelize';
import { createPass, comparePass } from '../services/hash';

import db from '../model';
import { signToken } from '../services/auth';

const Op = Sequelize.Op;

export async function signUp(req, res, next){

  const data = req.body;

  let response;

  console.log('DATA!!!!!!!!!', data)

  try {
    const pass = data.password;
    const hashPass = createPass(pass);
    const user = await db.User
    .findOrCreate({
      where: {
        email: data.email
      }, 
      defaults: {
        name: data.name,
        password: hashPass
      }
    })
    .spread((user, created) => {
      if(created) {

        const id = user.dataValues.id;
        const token = signToken(id);

        response = {
          message: 'Sign-up successfully',
          result: 1,
          data: {
            token,
            user: {
              user_id: id,
              name: data.name,
              email: data.email
            }
          }
        }
      } else {
        response = {
          message: 'Sorry, but this email already exist',
          result: 1
        }
      }
    })
  
    res.status(200).send(response);

  } catch(err) {

    next(new Error(err.message));
  }
}

export function signIn(req, res, next){

  const data = req.body;

  db.User
    .findOne({ where: { email: { [Op.eq]: data.email } } })
    .then(user => {
      if (user !== null && comparePass(user.dataValues, data.password)) {
        // req.session.user = user.dataValues.id;
        let token = signToken(user.dataValues.id);
        res.status(200).send({
          result: 1,
          data: {
            token,
            user: {
              user_id: user.id,
              name: user.name,
              email: user.email
            }
          },
          message: 'Sign-in successfully.'
        })
      } else  {
        res.status(401).send({
          result: 2,
          message: 'Login or password is incorrect.'
        })
      }
    })
    .catch(err => { 
      throw new Error(err.message)
    })
}

// export function logOut(req, res, next){

//   const sid = req.session.id;
//   const io = req.app.get('io');

//   req.session.destroy( function(err) {
    
//     io.sockets._events.sessionReload(sid);
//     if(err) return next(err);
//   });

//   res.status(200).send({
//     message: 'OK'
//   })
// }

// export function getUser(req, res, next){
  
//   let response;

//   if(req.user){

//     const currentUser = {
//       name: req.user.name,
//       id: req.user.id,
//       email: req.user.email,
//       avatar: req.user.avatar
//     };
    
//     response = {
//       message: 'User authorised',
//       result: 1,
//       data: {
//         user: currentUser
//       }
//     }
//   } else {

//     response = {
//       message: 'User unauthorised',
//       result: 1,
//     }
//   }

//   res.status(200).send(response);
// }