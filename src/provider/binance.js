'use strict';

const _ = require('lodash');
const Provider = require('./provider');

class BinanceProvider extends Provider {
  constructor(data) {
    super(data);
  }

  /**
   * Ger array of coins
   * @returns {Promise<any[]>}
   */
  async getCoins() {
    const {
      symbol
    } = this.data;
    const result = await this.download(
      `https://fapi.binance.com/fapi/v1/premiumIndex${symbol ? `?symbol=${symbol}` : ''}`);
    if (_.get(result, 'code', 0) === -1121) {
      throw new Error(_.get(result, 'msg', 'unknown'));
    }
    if (_.isObject(result)) {
      return [result];
    }
    return result;
  }
}

module.exports = BinanceProvider;