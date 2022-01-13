'use strict';

const express = require('express');
const coin = require('./routes/coin');

module.exports = () => {
  const app = express.Router();
  coin(app);
  return app;
};