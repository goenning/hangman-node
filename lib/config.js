'use strict';

const defaults = require('./default.json');
const config = require('../config.json');
const merged = { };

const isTesting = process.env.NODE_ENV === 'test';

for(const key in defaults) {
  merged[key] = defaults[key];

  if (!isTesting) {
    const configValue = config[key];
    if (configValue) {
      merged[key] = config[key];
    }
  }
}

module.exports = merged;
