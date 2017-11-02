const express = require('express');
const query = require('../database/queryHelpers.js');
const db = require('../database/index.js');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const Promise = require('bluebird');
const appendFile = Promise.promisify(fs.appendFile);
const port = 8080;

app.listen(port, () => {
  console.log('Server listening on port ', port);
});

app.use(bodyParser.json());

app.post('/clicks', function (req, res) {
  let click = req.body;
  appendFile('./elasticsearch/logs.json', `{"user_id":${click.user_id},"restaurant_id":${click.restaurant_id},"query_id":${click.query_id},"time":${Date.now().toString()},"type":"click","stage":"start"}\n`)
    .catch((err) => console.log('error writing log to file ', err));

  query.addClick(req.body)
    .then(() => res.status(200).send('Click POSTed'))
    .catch((err) => console.log('Error on click POST'));
});

app.post('/checkins', function (req, res) {
  let checkIn = req.body;
  appendFile('./elasticsearch/logs.json', `{"user_id":${checkIn.user_id},"restaurant_id":${checkIn.restaurant_id},"time":${Date.now().toString()},"type":"check-in","stage":"start"}\n`)
    .catch((err) => console.log('error writing log to file ', err));

  query.addCheckIn(checkIn)
    .then(() => res.status(200).send('Check-in POSTed'))
    .catch((err) => console.log('Error on check-in POST'));
});

app.post('/reviews', function (req, res) {
  let review = req.body;
  appendFile('./elasticsearch/logs.json', `{"user_id":${review.user_id},"restaurant_id":${review.restaurant_id},"star_rating":${review.star_rating},"time":${Date.now().toString()},"type":"review","stage":"start"}\n`)
    .catch((err) => console.log('error writing log to file ', err));

  query.addReview(review)
    .then(() => res.status(200).send('Review POSTed'))
    .catch((err) => console.log('Error on review POST'));
});
