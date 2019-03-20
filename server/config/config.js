module.exports = {
    port: process.env.PORT || 4000,
    env: process.env.NODE_ENV,
    root: process.env.PWD,
    db: {
      host: '127.0.0.1',
      user: 'postgres',
      pass: 'ruslan22577',
      name: 'ruslan',
      dialect: 'postgres',
      port: 5432
    },
    secret: 'vkjellow',
    session: { 
      secret: 'jellyfish',
      name: 'sid',
      cookie: {
        path: '/',
        httpOnly: true,
        maxAge: null
      },
      saveUninitialized: true
    }
}