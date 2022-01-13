'use strict';

const axios = require('axios');
const logger = require('../logger');

class Provider {
  constructor(data) {
    this.data = data;
  }

  async getCoins() {
  }

  async download(url) {
    let data;
    for (let a = 1; a <= 3; a++) {
      try {
        const response = await axios(url, {
          timeout: 15000,
          headers: {
            'User-Agent': 'Magic Browser'
          }
        });
        if (response.status === 200 && response.data) {
          data = response.data;
          break;
        }
      } catch (err) {
        logger.log('error', `download url ${url} failed at try ${a}.`, {
          err
        });
      }
    }
    if (!data) {
      throw new Error(`download url ${url} failed.`);
    }
    return data;
  }
}

module.exports = Provider;