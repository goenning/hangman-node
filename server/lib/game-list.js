'use strict';

const eol = require('os').EOL;
const now = process.hrtime;
const out = process.stdout;

const GameList = function() {
  console.log('New Game List');
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

  setInterval(() => {
    for(const key in all) {
      const diff = now(all[key].lastActiveAt);
      if (diff[0] >= 60) {
        out.write(`Game instance '${key}' was deleted due to inactiveness.${eol}`);
        delete all[key];
      }
    }
  }, 1 * 10 * 1000);
};

module.exports = GameList;
