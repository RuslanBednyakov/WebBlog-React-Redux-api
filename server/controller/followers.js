import db from '../model';

export async function deleteConnection(req, res, next) {
  try {

    const followerId = req.user;
    const followingId = req.params.id;

    const response = await db.Follower.destroy({
      where: {
        follower: followerId,
        following: followingId
      }
    });

    res.status(200).send({
      message: 'You succesfully unfollowed user!',
      data: response
    });
    
  } catch(err) {

    next(new Error(err.message));
  }

}


export async function createConnection(req, res, next) {
  try {

    const followerId = req.user;
    const followingId = req.body.following;

    const response = await db.Follower.create({
      follower: followerId,
      following: followingId,
    });

    res.status(200).send({
      message: 'You subscribed succesfully!',
      data: response
    });

  } catch(err) {
    
    next(new Error(err.message));
  }
}