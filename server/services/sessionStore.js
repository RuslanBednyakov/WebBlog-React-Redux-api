import session from 'express-session';
import db from '../model';

const SequelizeStore = require('connect-session-sequelize')(session.Store);

function extendDefaultFields(defaults, session) {
  return {
    data: defaults.data,
    expires: defaults.expires,
    userId: session.userId
  };
}

const sessionStore = new SequelizeStore({
  db: db,
  table: 'Session',
  extendDefaultFields: extendDefaultFields
})

export default sessionStore;