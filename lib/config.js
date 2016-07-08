'use strict';

const isTesting = process.env.NODE_ENV === 'test';
const defaults = require('./default.json');
const merged = { };

let config;
try {
  config = require('../config.json');
} catch(e) {
  config = { };
}


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
