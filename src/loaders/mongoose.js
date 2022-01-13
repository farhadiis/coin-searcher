'use strict';

const mongoose = require('mongoose');
const config = require('../config');

let _instance;

async function load() {
  _instance = await mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });
}

function instance() {
  return _instance.connection;
}

module.exports = {
  load,
  instance
};