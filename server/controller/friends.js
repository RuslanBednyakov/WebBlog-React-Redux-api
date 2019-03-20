import Sequelize from 'sequelize';
import db from '../model';
import * as customErrors from '../error'

const Op = Sequelize.Op;

export async function getUserFriends(req, res, next) {

  if (!req.user) return next(new customErrors.HttpError(401, 'Sorry, you are not authorised!'));

  try {

    const user_id = req.user;
    const response = await db.User.findAll({
      attributes: { exclude: ['password'] },
      where: { '$userFollowing.id$': user_id },
      include: [{
        model: db.User,
        as: 'userFollowing',
        attributes: { exclude: ['password'] },
        through: {
          where: { follower: user_id}
        }
      }]
    })
      
    res.status(200).send(response);
    
  } catch (err) {

    next(new Error(err.message));
  }
}