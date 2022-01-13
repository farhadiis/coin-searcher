'use strict';

const {
  validationResult
} = require('express-validator');

module.exports = {

  validate: (req) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      const first = error.array()[0];
      const e = new Error(`'${first.param}' in ${first.location}: ${first.msg}`);
      e.status = 400;
      throw e;
    }
  }
};