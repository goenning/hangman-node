# Technical requirements

You'll need Node.js 4+ or Docker.

## How to run it with Node.js

```
$ cd path/to/hangman
$ npm install
$ npm test
```

If all went well, just run:

```
$ npm start
```

Navigate to http://localhost:9090/ to start playing.

## How to run it with Docker

```
$ cd path/to/hangman
$ docker build -t hangman .
$ docker run -t -p 9090:9090 hangman
```

Navigate to http://localhost:9090/ to start playing.

# Configuration

You can set custom settings by changing the `config.json` file.
The possible keys are `maxMisses` (integer) and `availableWords` (array of strings)

# Bonus!

There is also a CLI for the game. Try it out:

```
$ cd path/to/hangman
$ npm install         #if not yet installed
$ npm link            # you may need sudo to run this
$ hangman             # to see the instructions
```

If you don't want to link it, it's also possible to run it directly with `node ./cli/index.js`.

# How to run it in a cluster

It's currently not possible, because `Hangman Server` relies on memory to store current game state.
It would be necessary to use a netword storage (like a database or cache service) to run it in a cluster.
