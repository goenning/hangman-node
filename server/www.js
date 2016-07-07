'use strict';

const eol = require('os').EOL;
const app = require('./app.js');

app.listen(9090, () => {
  process.stdout.write(`The server is running, visit http://localhost:9090.${eol}`);
});
