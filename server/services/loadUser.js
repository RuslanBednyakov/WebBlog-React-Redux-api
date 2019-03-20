import db from '../model'
import Sequelize from 'sequelize';

const Op = Sequelize.Op;

export function loadUser (req, res, next) {
  // res.locals used to write object user for all templates
  req.user = res.locals.user = null;
  if (!req.session.user) return next();
  db.User
  .findOne({ where: { id: { [Op.eq]: req.session.user } } })
  .then(user => {
    if (user !== null) {
      req.user = res.locals.user = user.dataValues;
      next();
    } else {
      next(err);
    }
  })
  .catch(err => { 
    throw new Error(err.message)
  })
}