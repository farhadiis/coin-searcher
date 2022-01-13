'use strict';

const logger = require('../logger');
const Container = require('typedi').Container;
const CoinService = require('../services/coin');
const ProviderFactory = require('../provider/factory');

module.exports = async () => {
  try {
    logger.log('verbose', 'coin update job fired...');
    const providerFactory = Container.get(ProviderFactory);
    const provider = providerFactory.getProvider({
      symbol: undefined
    });
    const coins = await provider.getCoins();
    const coinService = Container.get(CoinService);
    await coinService.updateAllCoin(coins);
  } catch (err) {
    logger.log('error', 'an error in update all coins, ' + err.message, {
      err
    });
  }
};