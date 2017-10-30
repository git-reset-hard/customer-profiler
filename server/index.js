let nextRestaurantId, nextUserId;

const express = require('express');
const query = require('../database/queryHelpers.js');
const app = express();
const bodyParser = require('body-parser');
const port = 8080;

app.listen(port, () => {
  console.log('Server listening on port ', port);
});

query.getCurrentUserId()
  .then((result) => { nextUserId = result + 1; })
  .catch((err) => console.log('Error getting next user ID'));

query.getCurrentRestaurantId()
  .then((result) => { nextRestaurantId = result + 1; })
  .catch((err) => console.log('Error getting next user ID'));

app.use(bodyParser.json());

app.post('/clicks', function (req, res) {
  query.addClick(click)
    .then(() => res.status(200).send('Click POSTed'))
    .catch((err) => console.log('Error on click POST'));
});

app.post('/checkins', function (req, res) {
  query.addCheckIn()
    .then(() => res.status(200).send('Check-in POSTed'))
    .catch((err) => console.log('Error on check-in POST'));
});

app.post('/reviews', function (req, res) {
  query.addReview()
    .then(() => res.status(200).send('Review POSTed'))
    .catch((err) => console.log('Error on review POST'));
});