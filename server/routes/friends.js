const express = require('express');
const router = express.Router();

import * as Controller from '../controller';


router.get('/', Controller.friends.getUserFriends);


export { router as friends };