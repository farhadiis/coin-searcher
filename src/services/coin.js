'use strict';

const logger = require('../logger');
const Coin = require('../models/coin');
const ProviderFactory = require('../provider/factory');
const _ = require('lodash');

class CoinService {
  constructor(container) {
    this.providerFactory = container.get(ProviderFactory);
  }
  /**
   * Update all coins or insert new coins.
   * @param coins {object[]}
   * @returns {Promise<void>}
   */
  async updateAllCoin(coins) {
    const usdtConins = _.filter(coins,
      (coin) => _.endsWith(_.get(coin, 'symbol', ''), 'USDT'));
    const updates = _.map(usdtConins, (coin) => ({
      updateOne: {
        filter: {
          symbol: coin.symbol,
          markPrice: {
            $ne: coin.markPrice
          }
        },
        update: {
          $set: coin
        },
        upsert: true
      }
    }));
    try {
      const result = await Coin.bulkWrite(updates, {
        ordered: false // continue on upsert error
      });
      logger.log('verbose',
        `update coins: modifiedCount: ${result.modifiedCount}, upsertedCount: ${result.upsertedCount}`);
    } catch (e) {
      logger.log('verbose',
        `update coins: modifiedCount: ${_.get(e, 'result.result.nModified')}, nonUpsertedCount: ${_.get(e, 'result.result.writeErrors.length')}`);
    }
  }

  /**
   * Update coin price.
   * @param data {{symbol: string, markPrice: number}}
   * @returns {Promise<boolean>} return update result
   */
  async updateSingleCoin(data) {
    const result = await Coin.updateOne({
      symbol: data.symbol
    }, {
      markPrice: data.markPrice
    }, {
      upsert: true
    });
    return _.get(result, 'ok', 0) !== 0;
  }

  /**
   * Find coins by symbol
   * @param data {{symbol: string=, pageNumber: number|string=, pageSize: number|string=}}
   * @returns {Promise<[]>} return array of coins
   */
  async findCoins(data) {
    const symbol = _.get(data, 'symbol') || null;
    const pageNumber = _.get(data, 'pageNumber') || null;
    const pageSize = _.get(data, 'pageSize') || null;
    const filter = {};
    const options = {
      sort: {
        updatedAt: -1
      }
    };
    if (symbol) {
      filter.symbol = {
        $regex: symbol + '.*'
      };
    }
    if (pageNumber && pageSize) {
      let number = Number(pageNumber) || 0;
      let size = Number(pageSize) || 0;
      if (size <= 0) {
        size = 1;
      }
      if (number < 0) {
        number = 0;
      }
      options.skip = number * size;
      options.limit = size;
    }
    let coins = await Coin.find(filter, null, options).lean();
    if (_.isEmpty(coins)) {
      const provider = this.providerFactory.getProvider({
        symbol: symbol
      });
      try {
        coins = await provider.getCoins();
        if (!_.isEmpty(coins)) {
          await Coin.insertMany(coins, {
            ordered: false // continue on upsert error
          });
        }
      } catch (err) {
        logger.log('error', err.message, {
          err
        });
      }
    }
    return coins;
  }
}

module.exports = CoinService;
