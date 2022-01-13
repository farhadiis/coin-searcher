'use strict';

const express = require('express');
const route = express.Router();
const Container = require('typedi').Container;
const CoinService = require('../../services/coin');
const logger = require('../../logger');
const _ = require('lodash');
const {
  body
} = require('express-validator');
const validator = require('../validator');

module.exports = (app) => {
  app.use('/coin', route);

  route.put('/',
    body('symbol')
      .exists({
        checkNull: true,
        checkFalsy: true
      }).withMessage('is required')
      .isString().withMessage('is string')
      .equals('USDTIRR').withMessage('is only USDTIRR'),
    body('markPrice')
      .exists({
        checkNull: true,
        checkFalsy: true
      }).withMessage('is required')
      .isFloat({
        min: 0,
        max: 100000
      }).withMessage('Mark price must be between 0 to 100000'),
    async (req, res, next) => {
      try {
        validator.validate(req);
        const coinService = Container.get(CoinService);
        const done = await coinService.updateSingleCoin(req.body);
        if (!done) {
          throw new Error('Coin update failed.');
        }
        res.status(200).send({
          success: true,
          message: 'Coin update successful.',
          data: null
        }).end();
        logger.log('verbose', 'Coin update successful.');
      } catch (err) {
        logger.log('error', 'Coin update failed in put endpoint.', {
          err
        });
        err.status = 400;
        next(err);
      }
    });

  route.get('/',
    async (req, res, next) => {
      try {
        const coinService = Container.get(CoinService);
        const result = await coinService.findCoins(req.query);
        if (!_.isEmpty(result)) {
          res.status(200).send({
            success: true,
            message: 'Coins found.',
            data: result
          }).end();
        } else {
          res.status(404).send({
            success: true,
            message: 'No coins.',
            data: []
          }).end();
        }
        logger.log('verbose', 'Coins find successful.');
      } catch (err) {
        logger.log('error', 'Coins find failed in get endpoint.', {
          err
        });
        err.status = 400;
        next(err);
      }
    });
};