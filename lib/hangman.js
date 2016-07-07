'use strict';

require('./ext.js');
const defaultOptions = require('./default.json');
const validChars = /^[a-zA-Z0-9]+$/;

const Hangman = function(word, options) {
  if (word && typeof word !== 'string') {
    options = word;
    word = undefined;
  }

  if (!(validChars.test(word)) && word)
    throw new Error(`'${word}' is not a valid word.`);

  const _options = options || { };

  if (!_options.maxMisses || _options.maxMisses <= 0)
    _options.maxMisses = defaultOptions.maxMisses;

  if (!_options.availableWords || _options.availableWords.length == 0)
    _options.availableWords = defaultOptions.availableWords;

  const _word = word || _options.availableWords.random();
  const _lcWord = _word.toLowerCase();
  const _letters = new Array(_word.length).fill('_');
  const _misses = [];
  const _guesses = [];

  this.getWord = () => {
    return _word;
  };

  this.getLetters = () => {
    return _letters;
  };

  this.guess = (input) => {
    if (!input || !(validChars.test(input)) || input.length > 1)
      throw new Error(`'${input}' is not a valid letter.`);

    const letter = input.toLowerCase();

    if (_guesses.indexOf(letter) === -1)
      _guesses.push(letter);

    const indexes = _lcWord.indexesOf(letter);
    if (indexes.length > 0) {
      for (const idx of indexes)
        _letters[idx] = _word[idx];
      return true;
    }

    if (_misses.indexOf(letter) === -1)
      _misses.push(letter);

    return false;
  };

  this.getStatus = () => {
    if (_misses.length >= _options.maxMisses)
      return Hangman.Status.Failed;

    if (_letters.indexOf('_') === -1)
      return Hangman.Status.Won;

    return Hangman.Status.InProgress;
  };

  this.getRemainingMissesCount = () => {
    return _options.maxMisses - _misses.length;
  };

  this.getGuesses = () => {
    return _guesses;
  };

  this.getMisses = () => {
    return _misses;
  };
};

Hangman.Status = {
  InProgress: 1,
  Won: 2,
  Failed: 3
};

module.exports = Hangman;
