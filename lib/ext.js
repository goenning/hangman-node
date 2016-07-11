'use strict';

if (!Array.prototype.random) {
  Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)];
  };
}

if (!String.prototype.indexesOf) {
  String.prototype.indexesOf = function(str) {
    const indexes = [ ];

    if (!str)
      return indexes;

    let idx = -1;
    do {
      idx = this.indexOf(str, idx+1);
      if (idx >= 0)
        indexes.push(idx);
    } while(idx >= 0);

    return indexes;
  };
}
