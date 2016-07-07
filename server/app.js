'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('index.pug');
});

app.use('/game', require('./routes/game.js'));

app.use((err, req, res, next) => {
  res.json({ success: false, id: req.body.id, error: err.message });
});

module.exports = app;
