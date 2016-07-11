'use strict';

require('./ext.js');
const defaultOptions = require('./default.json');
const validChars = /^[a-zA-Z0-9]+$/;

class Hangman {
  constructor(word, options) {
    if (word && typeof word !== 'string') {
      options = word;
      word = undefined;
    }

    if (!(validChars.test(word)) && word)
      throw new Error(`'${word}' is not a valid word.`);

    this._options = options || { };

    if (!this._options.maxMisses || this._options.maxMisses <= 0)
      this._options.maxMisses = defaultOptions.maxMisses;

    if (!this._options.availableWords || this._options.availableWords.length == 0)
      this._options.availableWords = defaultOptions.availableWords;

    this._word = word || this._options.availableWords.random();
    this._lcWord = this._word.toLowerCase();
    this._letters = new Array(this._word.length).fill('_');
    this._misses = [];
    this._guesses = [];
  }

  getWord() {
    return this._word;
  }

  getLetters() {
    return this._letters;
  }

  guess(input) {
    if (!input || !(validChars.test(input)) || input.length > 1)
      throw new Error(`'${input}' is not a valid letter.`);

    const letter = input.toLowerCase();

    if (this._guesses.indexOf(letter) === -1)
      this._guesses.push(letter);

    const indexes = this._lcWord.indexesOf(letter);
    if (indexes.length > 0) {
      for (const idx of indexes)
        this._letters[idx] = this._word[idx];
      return true;
    }

    if (this._misses.indexOf(letter) === -1)
      this._misses.push(letter);

    return false;
  }

  getStatus() {
    if (this._misses.length >= this._options.maxMisses)
      return Hangman.Status.Failed;

    if (this._letters.indexOf('_') === -1)
      return Hangman.Status.Won;

    return Hangman.Status.InProgress;
  }

  getRemainingMissesCount() {
    return this._options.maxMisses - this._misses.length;
  }

  getGuesses() {
    return this._guesses;
  }

  getMisses() {
    return this._misses;
  }
}

Hangman.Status = {
  InProgress: 1,
  Won: 2,
  Failed: 3
};

module.exports = Hangman;
