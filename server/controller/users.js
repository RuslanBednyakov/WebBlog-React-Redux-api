import Sequelize from 'sequelize';
import db from '../model';

const Op = Sequelize.Op;

export function getUsersByName(req, res, next){

  console.log('Searching!!!!!!!!!!!!!', )

  const data = req.body;
  let user_id = null;

  if(req.user) {

    user_id = req.user;
  }
  console.log('Searching', data.name)
  console.log('Searching', user_id)
  db.User
    .findAndCountAll({ 
      attributes: { exclude: ['password'] },
      where: { 
        name: { [Op.iLike]: `%${data.name}%`},
        id: {[Op.ne]: user_id}
      },
      include: [{
        model: db.User,
        as: 'userFollowing',
        attributes: { exclude: ['password'] },
        through: {
          where: { follower: user_id}
        }
      }] 
    })
    .then(users => {
      console.log('Searching result', users)
      if (users !== null) {
        res.status(200).send({
          result: 1,
          data: users,
          message: 'Search successfull'
        })
      } else  {
        res.send({
          result: 2,
          message: 'No results'
        })
      }
    })
    .catch(err => { 
      throw new Error(err.message)
    })
}