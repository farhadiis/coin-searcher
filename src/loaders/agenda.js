'use strict';

const Agenda = require('agenda');
const config = require('../config');
const coinUpdaterJob = require('../jobs/coinUpdaterJob');

const coinUpdaterKey = 'coinUpdater';
let _instance;

async function load() {
  _instance = new Agenda({
    db: {
      address: config.MONGODB_URI,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    }
  });
  await _instance.define(coinUpdaterKey, coinUpdaterJob);
  await _instance.start();
  await _instance.every(config.COIN_UPDATE_PERIOD, coinUpdaterKey);
}

function instance() {
  return _instance;
}

module.exports = {
  load,
  instance
};