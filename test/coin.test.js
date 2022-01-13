'use strict';

const request = require('supertest');
const app = require('../src');
const _ = require('lodash');
const Coin = require('../src/models/coin');
const CoinService = require('../src/services/coin');

const sinon = require('sinon');
const chai = require('chai');
chai.should();
// const expect = require('chai').expect;
// chai.use(require('sinon-chai'));

describe('Coin Test', () => {
  beforeEach(async () => {
    await Coin.deleteMany();
  });

  it('should work http src', async () => {
    await request(app).head('/status').type('json').send().expect(200);
  });

  it('should work http src', async () => {
    await request(app).get('/status').type('json').send().expect(200);
  });

  it('should return 400 for send empty post', async () => {
    await request(app).post('/api/coin').type('json').send().expect(404);
  });

  it('check find coins by download', async () => {
    const downloaded = [{
      'symbol': 'RAYUSDT',
      'markPrice': '43667.79000000',
      'indexPrice': '43678.64037912',
      'estimatedSettlePrice': '43723.00921286',
      'lastFundingRate': '0.00010000',
      'interestRate': '0.00010000',
      'nextFundingTime': 1642060800000,
      'time': 1642057041006
    }];
    const mockProvider = {
      getCoins: sinon.stub().returns(downloaded)
    };
    const mockProviderFactory = {
      getProvider: sinon.stub().returns(mockProvider)
    };
    const coinService = new CoinService();
    const providerFactoryStub = sinon.stub(coinService, 'providerFactory');
    providerFactoryStub.value(mockProviderFactory);
    const coins = await coinService.findCoins({
      symbol: 'RAYUSDT'
    });
    coins.should.deep.equal(downloaded);
    providerFactoryStub.restore();
  });

  it('check import coins in database', async () => {
    const coins = [
      {
        'symbol': 'BTCUSDT',
        'markPrice': '43667.79000000',
        'indexPrice': '43678.64037912',
        'estimatedSettlePrice': '43723.00921286',
        'lastFundingRate': '0.00010000',
        'interestRate': '0.00010000',
        'nextFundingTime': 1642060800000,
        'time': 1642057041006
      },
      {
        'symbol': 'RAYUSDT',
        'markPrice': '5.51649325',
        'indexPrice': '5.51999449',
        'estimatedSettlePrice': '5.50911891',
        'lastFundingRate': '-0.00030206',
        'interestRate': '0.00010000',
        'nextFundingTime': 1642060800000,
        'time': 1642057072005
      },
      {
        'symbol': 'SUSHIUSDT',
        'markPrice': '7.03434639',
        'indexPrice': '7.03425534',
        'estimatedSettlePrice': '7.02890694',
        'lastFundingRate': '0.00010000',
        'interestRate': '0.00010000',
        'nextFundingTime': 1642060800000,
        'time': 1642057072005
      },
      {
        'symbol': 'CVCUSDT',
        'markPrice': '0.33482151',
        'indexPrice': '0.33481718',
        'estimatedSettlePrice': '0.33491626',
        'lastFundingRate': '0.00010000',
        'interestRate': '0.00010000',
        'nextFundingTime': 1642060800000,
        'time': 1642057072005
      }
    ];
    const coinService = new CoinService();
    await coinService.updateAllCoin(coins);

    const insertedCoins = _.forEach(await Coin.find().lean(), (c) => delete c._id);
    insertedCoins.should.deep.equal(coins);
  });

  it('check update single coin in database', async () => {
    const coin = {
      'symbol': 'USDTIRR',
      'markPrice': '5'
    };
    const coinService = new CoinService();
    const result = await coinService.updateSingleCoin(coin);
    result.should.to.equal(true);
    const insertedCoin = await Coin.findOne({
      symbol: coin.symbol
    }).lean();
    insertedCoin.should.deep.includes(coin);
  });
});