const express = require('express');

const routerProtected = express.Router();
const routerUnprotected = express.Router();

import { auth } from './auth';
import { search } from './search';
import { posts } from './posts';
import { friends } from './friends';
import { followers } from './followers';

routerProtected.use('/posts', posts);
routerProtected.use('/search', search);
routerProtected.use('/followers', followers);
routerProtected.use('/friends', friends);
routerUnprotected.use('/auth', auth);

export default {
  protected: routerProtected,
  unprotected: routerUnprotected
};