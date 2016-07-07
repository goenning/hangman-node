'use strict';

const defaults = require('./default.json');
const config = require('../config.json');
const merged = { };

for(const key in defaults) {
  merged[key] = defaults[key];

  const configValue = config[key];
  if (configValue) {
    merged[key] = config[key];
  }
}

module.exports = merged;
