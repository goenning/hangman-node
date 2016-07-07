'use strict';

const Hangman = require('../../lib');
const expect = require('chai').expect;
const defaultOptions = require('../../lib/default.json');

const options = {
  availableWords: [ 'Space', 'Juno', 'Jupter' ],
  maxMisses: 6
};

describe('Hangman', () => {

  it('should start with default values', () => {
    const hangman = new Hangman('Bed', options);
    expect(hangman.getMisses()).to.deep.equal([ ]);
    expect(hangman.getMisses()).to.deep.equal([ ]);
    expect(hangman.getGuesses()).to.deep.equal([ ]);
    expect(hangman.getLetters()).to.deep.equal(['_', '_', '_']);
    expect(hangman.getStatus()).to.be.equal(Hangman.Status.InProgress);
    expect(hangman.getRemainingMissesCount()).to.be.equal(options.maxMisses);
  });

  it('should use the given word', () => {
    const hangman = new Hangman('Shirt');
    expect(hangman.getWord()).to.be.equal('Shirt');
  });

  it('should use default values when options is not set', () => {
    const hangman = new Hangman();
    expect(hangman.getWord()).to.be.oneOf(defaultOptions.availableWords);
    expect(hangman.getRemainingMissesCount()).to.be.equal(defaultOptions.maxMisses);
  });

  it('should return a random word when word is not set but options is set', () => {
    const hangman = new Hangman(options);
    expect(hangman.getWord()).to.be.oneOf(options.availableWords);
  });

  it('should return a random word when word is undefined but options is set', () => {
    const hangman = new Hangman(undefined, options);
    expect(hangman.getWord()).to.be.oneOf(options.availableWords);
  });

  [ '', undefined, null].forEach((word) => {
    it(`should return a random word when it\'s '${word}'`, () => {
      const hangman = new Hangman(word, options);
      expect(hangman.getWord()).to.be.oneOf(options.availableWords);
    });
  });


  it('should add to miss/guess list when guessing wrong letter', () => {
    const hangman = new Hangman('Shirt', options);

    const found = hangman.guess('k');
    expect(found).to.be.false;
    expect(hangman.getMisses()).to.deep.equal(['k']);
    expect(hangman.getGuesses()).to.deep.equal(['k']);
    expect(hangman.getRemainingMissesCount()).to.be.equal(options.maxMisses - 1);
  });

  it('should not add to miss list, but add to guess list, when guessing right letter', () => {
    const hangman = new Hangman('Shirt');

    const found = hangman.guess('s');
    expect(found).to.be.true;
    expect(hangman.getMisses()).to.deep.equal([ ]);
    expect(hangman.getGuesses()).to.deep.equal(['s']);
  });

  it('should not add to miss/guess list when guessing the same wrong letter twice', () => {
    const hangman = new Hangman('Shirt');

    hangman.guess('e');
    hangman.guess('e');

    expect(hangman.getMisses()).to.deep.equal(['e']);
    expect(hangman.getGuesses()).to.deep.equal(['e']);
  });

  it('should not change status when guessing wrong letter', () => {
    const hangman = new Hangman('Shirt');
    hangman.guess('k');
    expect(hangman.getLetters()).to.deep.equal(['_', '_', '_', '_', '_']);
  });

  it('should add letter to status when guessing right letter', () => {
    const hangman = new Hangman('Shirt');
    hangman.guess('s');
    expect(hangman.getLetters()).to.deep.equal(['S', '_', '_', '_', '_']);
  });

  it('should add letter to both spaces when guessing letter with more than 1 occurrence', () => {
    const hangman = new Hangman('Order');
    hangman.guess('r');
    expect(hangman.getLetters()).to.deep.equal(['_', 'r', '_', '_', 'r']);
  });

  it('should change status to Won when guessed the whole word', () => {
    const hangman = new Hangman('Order');
    hangman.guess('o');
    hangman.guess('d');
    hangman.guess('r');
    hangman.guess('e');
    expect(hangman.getStatus()).to.be.equal(Hangman.Status.Won);
    expect(hangman.getLetters()).to.deep.equal(['O', 'r', 'd', 'e', 'r']);
  });

  it(`should change status to Failed when missed ${options.maxMisses} times`, () => {
    const hangman = new Hangman('Order', options);
    hangman.guess('x');
    hangman.guess('y');
    hangman.guess('z');
    hangman.guess('u');
    hangman.guess('i');
    hangman.guess('b');
    expect(hangman.getStatus()).to.be.equal(Hangman.Status.Failed);
    expect(hangman.getRemainingMissesCount()).to.be.equal(0);
  });

  it('should not throw error when guessing valid letters', () => {
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('').forEach((letter) => {
      const hangman = new Hangman();
      hangman.guess(letter);

      expect(hangman.getGuesses()).to.deep.equal([ letter.toLowerCase() ]);
    });
  });

  [ '', '@', undefined, null, ' ', [], {}, '`', '[', 'ab', '12', '+', '_', '.', '-'].forEach((letter) => {
    it(`should throw error when guessing '${letter}'`, () => {
      const hangman = new Hangman('Order');
      expect(hangman.guess.bind(hangman, letter)).to.throw(`'${letter}' is not a valid letter.`);
    });
  });

  [ '3d@hubs', '3d-hubs', '3d hubs', ' '].forEach((word) => {
    it(`should throw error when word is invalid: '${word}'`, () => {
      expect(() => new Hangman(word)).to.throw(`'${word}' is not a valid word.`);
    });
  });

});
