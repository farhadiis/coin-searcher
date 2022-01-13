'use strict';

const {
  createLogger, format, transports
} = require('winston');
const {
  combine, timestamp, printf
} = format;
const config = require('../config');
const _ = require('lodash');
const devMode = (config.NODE_ENV !== 'production');
const logLevel = process.env.LOG_LEVEL || (devMode ? 'debug' : 'verbose');

const myTransports = [];

myTransports.push(new transports.File({
  filename: 'coin-searcher.log'
  // level: 'error'
})); // log management software like logstash

if (devMode) {
  const myFormat = printf(({
    level, message, timestamp
  }) => {
    return `${timestamp} ${level}: ${message}`;
  });
  myTransports.push(new transports.Console({
    format: combine(
      format.colorize(),
      timestamp(),
      myFormat
    ),
    level: logLevel
  }));
}

const logger = createLogger({
  level: logLevel,
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: myTransports
});

/**
 *
 * @param level
 * @param text
 * @param metadata : {err} object
 */
function log(level, text, metadata) {
  const newMeta = _.cloneDeep(metadata);
  try {
    _.forIn(newMeta, (item, key) => {
      if (_.isError(item)) {
        newMeta[key] = {
          message: _.get(item, 'message'),
          stack: _.get(item, 'stack')
        };
      } else if (_.isObject(item)) {
        newMeta[key] = JSON.stringify(item);
      }
    });
    logger.log(level, text, newMeta);
  } catch (e) {
    console.log('error happened', e);
  }
}

module.exports = {
  /**
   *
   * log(level,text,metadata)
   * @level: one of :['error','warn','info','verbose','debug','silly'] #listed by priority
   * @text: string
   * @metadata: json key value object
   *
   * Example of calling log function:
   * require('logger').log('info','server is started',{moment().unix()})
   */
  log: log
};