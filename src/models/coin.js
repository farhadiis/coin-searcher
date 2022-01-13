'use strict';

const mongoose = require('mongoose');
const config = require('../config');

const Coin = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      index: true,
      unique: true
    },
    markPrice: {
      type: String,
      required: true
    },
    indexPrice: {
      type: String,
      required: true
    },
    estimatedSettlePrice: {
      type: String,
      required: true
    },
    lastFundingRate: {
      type: String,
      required: true
    },
    interestRate: {
      type: String,
      required: true
    },
    nextFundingTime: {
      type: Number,
      required: true
    },
    time: {
      type: Number,
      required: true
    }
  }
);

module.exports = mongoose.model('Coin', Coin, config.NODE_ENV !== 'production' ? 'coins-dev' : 'coins');