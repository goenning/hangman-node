'use strict';

const express = require('express');
const Hangman = require('../../lib');
const GameList = require('../lib/game-list.js');
const options = require('../../lib/config.js');
const uuid = require('node-uuid');

const router = express.Router();
const games = new GameList();

const currentState = (id) => {
  const game = games.get(id);
  if (!game)
    return { success: false, id, error: 'Could not find your game. Start a new one.' };

  const gameStatus = game.getStatus();
  const response = {
    success: true,
    id,
    status: game.getStatus(),
    letters: game.getLetters(),
    guesses: game.getGuesses(),
    remainingMissesCount: game.getRemainingMissesCount(),
    word: gameStatus === Hangman.Status.InProgress ? undefined : game.getWord()
  };

  if (gameStatus !== Hangman.Status.InProgress)
    games.delete(id);

  return response;
};

router.post('/new', (req, res) => {
  const id = req.body.id || uuid.v4();
  const game = new Hangman(req.body.word, options);
  games.add(id, game);

  res.json(currentState(id));
});

router.post('/guess', (req, res) => {
  const game = games.get(req.body.id);
  if (game)
    game.guess(req.body.letter);

  res.json(currentState(req.body.id));
});

module.exports = router;
