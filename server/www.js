'use strict';

const eol = require('os').EOL;
const app = require('./app.js');

app.listen(8080, () => {
  process.stdout.write(`The server is running, visit http://localhost:8080.${eol}`);
});
