'use strict';

const app = require('../../server/app.js');
const request = require('supertest');
const expect = require('chai').expect;
const async = require('async');

describe('Hangman server', () => {

  it('should start new game when posting to /game/new', (done) => {
    request(app)
      .post('/game/new')
      .expect(200)
      .expect((res) => {
        expect(res.body.success).to.be.true;
        expect(res.body.status).to.be.equal(1);
        expect(res.body.word).to.be.undefined;
        expect(res.body.guesses).to.deep.equal([ ]);
      }).end(done);
  });

  it('should add to guess list when posting to /game/guess', (done) => {
    let id;

    async.series({
      start: (callback) => {
        request(app).post('/game/new').send({ word: 'banana' })
          .end((err, res) => {
            id = res.body.id;
            callback(err, res);
          });
      },
      guess: (callback) => {
        request(app).post('/game/guess').send({ id, letter: 'a' }).end(callback);
      }
    },
    (err, results) => {
      expect(results.guess.body.success).to.be.true;
      expect(results.guess.body.status).to.be.equal(1);
      expect(results.guess.body.word).to.be.undefined;
      expect(results.guess.body.letters).to.deep.equal([ '_', 'a', '_', 'a', '_', 'a' ]);
      expect(results.guess.body.guesses).to.deep.equal([ 'a' ]);
      done();
    });
  });

  it('should return word when it\'s the last post to /game/guess', (done) => {
    let id;

    async.series({
      start: (callback) => {
        request(app).post('/game/new').send({ word: 'banana' })
          .end((err, res) => {
            id = res.body.id;
            callback(err, res);
          });
      },
      guessA: (callback) => {
        request(app).post('/game/guess').send({ id, letter: 'a' }).end(callback);
      },
      guessB: (callback) => {
        request(app).post('/game/guess').send({ id, letter: 'b' }).end(callback);
      },
      guessN: (callback) => {
        request(app).post('/game/guess').send({ id, letter: 'n' }).end(callback);
      }
    },
    (err, results) => {
      expect(results.guessN.body.success).to.be.true;
      expect(results.guessN.body.status).to.be.equal(2);
      expect(results.guessN.body.word).to.be.equal('banana');
      expect(results.guessN.body.letters).to.deep.equal([ 'b', 'a', 'n', 'a', 'n', 'a' ]);
      expect(results.guessN.body.guesses).to.deep.equal([ 'a', 'b', 'n' ]);
      done();
    });
  });

});
