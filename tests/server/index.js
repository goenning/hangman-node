'use strict';

const app = require('../../server/app.js');
const request = require('supertest');
const expect = require('chai').expect;
const async = require('async');

let id;

const startGame = (word, cb) => request(app).post('/game/new').send({ word }).end((err, res) => {
  id = res.body.id;
  cb(err, res);
});
const sendLetter = (letter, cb) => request(app).post('/game/guess').send({ id, letter }).end(cb);

describe('Hangman server', () => {

  beforeEach(() => { id = undefined; });

  it('should render html page for /', (done) => {
    request(app)
      .get('/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
      .end(done);
  });

  it('should start new game when posting to /game/new', (done) => {
    async.series({
      start: (cb) => startGame('banana', cb)
    }, (err, results) => {
      expect(results.start.body.success).to.be.true;
      expect(results.start.body.status).to.be.equal(1);
      expect(results.start.body.word).to.be.undefined;
      expect(results.start.body.guesses).to.deep.equal([ ]);
      done(err);
    });
  });

  it('should add to guess list when posting to /game/guess', (done) => {
    async.series({
      start: (cb) => startGame('banana', cb),
      guessA: (cb) => sendLetter('a', cb)
    }, (err, results) => {
      expect(results.guessA.body.success).to.be.true;
      expect(results.guessA.body.status).to.be.equal(1);
      expect(results.guessA.body.word).to.be.undefined;
      expect(results.guessA.body.letters).to.deep.equal([ '_', 'a', '_', 'a', '_', 'a' ]);
      expect(results.guessA.body.guesses).to.deep.equal([ 'a' ]);
      done(err);
    });
  });

  it('should return word when game is won', (done) => {
    async.series({
      start: (cb) => startGame('banana', cb),
      guessA: (cb) => sendLetter('a', cb),
      guessB: (cb) => sendLetter('b', cb),
      guessN: (cb) => sendLetter('n', cb)
    }, (err, results) => {
      expect(results.guessA.body.word).to.be.undefined;
      expect(results.guessB.body.word).to.be.undefined;

      expect(results.guessN.body.success).to.be.true;
      expect(results.guessN.body.status).to.be.equal(2);
      expect(results.guessN.body.letters).to.deep.equal([ 'b', 'a', 'n', 'a', 'n', 'a' ]);
      expect(results.guessN.body.guesses).to.deep.equal([ 'a', 'b', 'n' ]);
      expect(results.guessN.body.word).to.be.equal('banana');
      done(err);
    });
  });

  it('should return word when game is lost', (done) => {
    async.series({
      start: (cb) => startGame('banana', cb),
      guess1: (cb) => sendLetter('1', cb),
      guess2: (cb) => sendLetter('2', cb),
      guess3: (cb) => sendLetter('3', cb),
      guess4: (cb) => sendLetter('4', cb),
      guess5: (cb) => sendLetter('5', cb)
    }, (err, results) => {
      expect(results.guess1.body.word).to.be.undefined;
      expect(results.guess2.body.word).to.be.undefined;
      expect(results.guess3.body.word).to.be.undefined;
      expect(results.guess4.body.word).to.be.undefined;

      expect(results.guess5.body.success).to.be.true;
      expect(results.guess5.body.status).to.be.equal(3);
      expect(results.guess5.body.word).to.be.equal('banana');
      expect(results.guess5.body.letters).to.deep.equal([ '_', '_', '_', '_', '_', '_' ]);
      expect(results.guess5.body.guesses).to.deep.equal([ '1', '2', '3', '4', '5' ]);
      done(err);
    });
  });

  it('should return a failure response when guessing unknown game id', (done) => {
    id = 'i-dont-exist';
    async.series({
      guess: (cb) => sendLetter('a', cb)
    }, (err, results) => {
      expect(Object.keys(results.guess.body)).to.deep.equal(['success', 'id', 'error']);
      expect(results.guess.body.success).to.be.false;
      expect(results.guess.body.id).to.be.equal('i-dont-exist');
      done(err);
    });
  });

  it('should return a failure response when trying to start a game with invalid word', (done) => {
    id = undefined;
    async.series({
      start: (cb) => startGame('3d@hubs', cb)
    }, (err, results) => {
      expect(Object.keys(results.start.body)).to.deep.equal(['success', 'error']);
      expect(results.start.body.success).to.be.false;
      done(err);
    });
  });

});
