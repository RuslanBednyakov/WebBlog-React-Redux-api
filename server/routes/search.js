const express = require('express');
const router = express.Router();

import * as Controller from '../controller';


router.post('/user', Controller.users.getUsersByName);


export { router as search };