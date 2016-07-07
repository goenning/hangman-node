'use strict';

const TIMEOUT = 300;
const TIMEOUT_CHECK = 10;

const eol = require('os').EOL;
const now = process.hrtime;
const out = process.stdout;

const GameList = function() {
  const all = { };

  this.add = (id, game) => {
    all[id] = {
      game,
      lastActiveAt: now()
    };
  };

  this.get = (id) => {
    const instance = all[id];
    if (instance) {
      instance.lastActiveAt = now();
      return instance.game;
    }
  };

  this.delete = (id) => {
    delete all[id];
  };

  setInterval(() => {
    for(const key in all) {
      const diff = now(all[key].lastActiveAt);
      if (diff[0] >= TIMEOUT) {
        out.write(`Game instance '${key}' was deleted due to inactiveness.${eol}`);
        this.delete(key);
      }
    }
  }, TIMEOUT_CHECK * 1000);
};

module.exports = GameList;
