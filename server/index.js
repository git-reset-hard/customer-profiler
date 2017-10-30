const express = require('express');
const db = require('../database/index.js');
const app = express();
const bodyParser = require('body-parser');
const port = 8080;

app.listen(port, () => {
  console.log('Server listening on port ', port);
});

// TODO: create endpoints for POSTing clicks, reviews, check-ins

app.use(bodyParser.json());

app.post('/clicks', function (req, res) {
  db.addClick(req.body)
    .then(() => res.status(200).send('Click POSTed'))
    .catch((err) => console.log('Error on click POST'));
});

app.post('/checkins', function (req, res) {
  res.status(200).send('Check-in POSTed');
});

app.post('/reviews', function (req, res) {
  res.status(200).send('Review POSTed');
});

console.log(db);