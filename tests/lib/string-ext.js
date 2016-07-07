'use strict';

require('../../lib/ext.js');
const expect = require('chai').expect;

describe('String extension', () => {

  [
    { word: 'Marvin', letter: '',  indexes: [ ] },
    { word: 'Marvin', letter: ' ', indexes: [ ] },
    { word: 'Marvin', letter: 'x', indexes: [ ] },
    { word: 'Marvin', letter: 'm', indexes: [ ] },
    { word: 'Marvin', letter: 'M', indexes: [ 0 ] },
    { word: 'Space Marvin', letter: 'a', indexes: [ 2, 7 ] }
  ].forEach((item) => {
    it(`should return [${item.indexes}] when searching for '${item.letter}' in '${item.word}'`, () => {
      expect(item.word.indexesOf(item.letter)).to.deep.equal(item.indexes);
    });
  });

});
