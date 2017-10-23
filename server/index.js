const express = require('express');
const db = require('../database/index.js');
const app = express();
const port = 8080;


app.listen(port, () => {
  console.log('Server listening on port ', port);
});

// TODO: create endpoints for POSTing clicks, reviews, check-ins