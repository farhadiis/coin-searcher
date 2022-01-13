'use strict';

const mongoose = require('./mongoose');
const expressLoader = require('./express');
const agenda = require('./agenda');
const logger = require('../logger');

module.exports = async (expressApp) => {
  await mongoose.load();
  logger.log('verbose', 'MongoDB Initialized');
  await expressLoader(expressApp);
  logger.log('verbose', 'Express Initialized');
  await agenda.load();
  logger.log('verbose', 'Agenda Initialized');
};