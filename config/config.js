const path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'stoker'
    },
    port: process.env.PORT || 3001,
    db: 'mongodb://localhost/stoker-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'stoker'
    },
    port: process.env.PORT || 3001,
    db: 'mongodb://localhost/stoker-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'stoker'
    },
    port: process.env.PORT || 3001,
    db: 'mongodb://localhost/stoker-production'
  }
};

module.exports = config[env];
