import Sequelize from 'sequelize';
import db from '../model';

const Op = Sequelize.Op;

export async function getPostsByUserId(req, res, next){


  try {
    const id = req.params.id;

    const response = await db.Post.findAll({
      where: { user_id: id }
    });

    res.status(200).send(response);

  } catch(err) {
    
    next(new Error(err.message));
  }

}

export async function getPostsFriends(req, res, next) {

  try {

    const id = req.params.id;
    const response = await db.Post.findAll({
      where: { '$User.userFollowing.id$': id },
      include: [{
        model: db.User,
        attributes: { exclude: ['password'] },
        include: [{
          model: db.User,
          as: 'userFollowing',
          attributes: { exclude: ['password'] },
          through: {
            where: { follower: id}
          }
        }]
      }]
    })
      
    res.status(200).send(response);
    
  } catch (err) {

    next(new Error(err.message));
  }
}

export async function createNewPost(req, res, next) {
  try {
    const data = req.body;
    const response = await db.Post.create({
      user_id: data.user_id,
      title: data.title,
      content: data.content,
      date: data.date 
    });

    res.status(201).send(response);

  } catch(err) {
    
    next(new Error(err.message));
  }
}