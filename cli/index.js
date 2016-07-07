#!/usr/bin/env node
'use strict';

const meow = require('meow');
const clear = require('clear');
const commands = require('./commands');

const cli = meow({
  help: `
    Usage
      $ hangman <command>

    Command
      new <word>

    Examples
      $ hangman new          #start a new HANGMAN game with a random word
      $ hangman new chicken  #start a new HANGMAN game with 'chicken' as the word
  `});

clear();

const commandName = (cli.input.length > 0) ? cli.input[0] : undefined;
const command = commands[commandName];
if (command)
  command(cli);
else
  cli.showHelp();
