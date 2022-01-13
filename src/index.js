'use strict';

const express = require('express');
const logger = require('./logger');
const loaders = require('./loaders');
const config = require('./config');
const mongoose = require('./loaders/mongoose');
const agenda = require('./loaders/agenda');

const app = express();

(async () => {
  await loaders(app);

  const server = app.listen(config.PORT, () => {
    const port = server.address().port;
    logger.log('verbose', `Server listening on port: ${port}`);
  }).on('error', (err) => {
    logger.log('error', 'Server start failed.', {
      err
    });
    process.exit(1);
  });
})();

const graceful = async () => {
  const seconds = 2;
  const name = require('../package.json').name;
  logger.log('verbose', `${name} will shut down after ${seconds} seconds.`);
  try {
    if (mongoose.instance()) {
      await mongoose.instance().close();
    }
    if (agenda.instance()) {
      await agenda.instance().stop();
    }
  } catch (err) {
    logger.log('error', name + ' was not able to graceful stop due to the following error: ', {
      err
    });
  }
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  process.exit(0);
};

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);
process.on('SIGUSR1', graceful);
process.on('uncaughtException', function (err) {
  logger.log('error', 'uncaught exception', {
    err
  });
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

module.exports = app;