'use strict';

const _ = require('lodash');
const BinanceProvider = require('./binance');

const providers = [BinanceProvider];

class ProviderFactory {
  getProvider(data) {
    if (!_.has(data, 'symbol')) {
      throw new Error('symbol is required.');
    }
    const provider = providers[Math.floor(Math.random() * providers.length)];
    return new provider(data);
  }
}

module.exports = ProviderFactory;