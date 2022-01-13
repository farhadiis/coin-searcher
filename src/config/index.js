'use strict';

module.exports = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.SERVICE_DB_URI || 'mongodb://localhost/coin',

  COIN_UPDATE_PERIOD: process.env.COIN_UPDATE_PERIOD || '5 minutes',

  API: {
    prefix: '/api'
  }
};