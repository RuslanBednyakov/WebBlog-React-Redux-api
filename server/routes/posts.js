const express = require('express');
const router = express.Router();

import * as Controller from '../controller';


router.get('/:id', Controller.posts.getPostsByUserId);

router.get('/:id/friends', Controller.posts.getPostsFriends);

router.post('/', Controller.posts.createNewPost);



export { router as posts };