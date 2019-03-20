const express = require('express');

const router = express.Router();
import * as Controller from '../controller';

router.delete('/:id', Controller.followers.deleteConnection);

router.post('/', Controller.followers.createConnection);

export { router as followers };