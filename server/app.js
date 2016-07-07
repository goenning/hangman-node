'use strict';

const express = require('express');
const app = express();
const Hangman = require('../lib');
const bodyParser = require('body-parser');
const uuid = require('node-uuid');

const games = { };

const currentState = (id) => {
  const game = games[id];
  if (game) {
    const gameStatus = game.getStatus();
    const response = {
      success: true,
      id,
      status: game.getStatus(),
      letters: game.getLetters(),
      guesses: game.getGuesses(),
      remainingMissesCount: game.getRemainingMissesCount(),
      word: gameStatus == Hangman.Status.InProgress ? undefined : game.getWord()
    };

    if (gameStatus !== Hangman.Status.InProgress)
      delete games[id];

    return response;
  } else {
    return { success: false, id, error: 'Could not find your game. Start a new one.' };
  }
};

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('index.pug');
});

app.post('/game/new', (req, res) => {
  const id = req.body.id || uuid.v4();
  const game = new Hangman(req.body.word);
  games[id] = game;

  res.json(currentState(id, game));
});

app.post('/game/guess', (req, res) => {
  const game = games[req.body.id];
  if (game)
    game.guess(req.body.letter);

  res.json(currentState(req.body.id));
});

app.use((err, req, res, next) => {
  res.json({ success: false, id: req.body.id, error: err.message });
});

module.exports = app;
