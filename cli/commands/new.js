'use strict';

const Hangman = require('../../lib');
const options = require('../../lib/config.js');
const clear = require('clear');
const eol = require('os').EOL;

const stdin = process.stdin;
const stdout = process.stdout;
stdin.setEncoding('utf8');

require('readline').emitKeypressEvents(stdin);
if (stdin.isTTY)
  stdin.setRawMode(true);

const skipLine = (count) => {
  for(let i=0;i<(count || 1);i++)
    stdout.write(`${eol}`);
};

const show = (hangman) => {
  const status = hangman.getStatus();
  show[status](hangman);
};

show[Hangman.Status.Won] = (hangman) => {
  clear();
  stdout.write('Congratulations! You Won! The word is: ');
  hangman.getLetters().forEach((letter) => stdout.write(letter));
  skipLine();
  process.exit();
};

show[Hangman.Status.Failed] = (hangman) => {
  clear();
  stdout.write(`Ohhh! You lost... But you can always try again. The word is: ${hangman.getWord()}`);
  skipLine();
  process.exit();
};

show[Hangman.Status.InProgress] = (hangman) => {
  clear();
  hangman.getLetters().forEach((letter) => stdout.write(letter));
  skipLine(2);
  stdout.write('Guesses: ');
  stdout.write(hangman.getGuesses().toString());
  skipLine(2);

  stdout.write('What\'s your guess?. ');
  const remainingMissesCount = hangman.getRemainingMissesCount();
  stdout.write(remainingMissesCount === 1 ? 'You have only one more chance.' : `You can only miss ${hangman.getRemainingMissesCount()} times`);
  skipLine();
};

module.exports = (cli) => {
  const word = cli.input.length > 1 ? cli.input[1] : undefined;
  const hangman = new Hangman(word, options);

  show(hangman);

  stdin.on('keypress', (letter, key) => {
    if(key && key.name === 'c' && key.ctrl) {
      clear();
      process.exit();
    }

    try {
      hangman.guess(letter);
      show(hangman);
    } catch(e) {
      show(hangman);
      console.log(e.message);
    }
  });

};
