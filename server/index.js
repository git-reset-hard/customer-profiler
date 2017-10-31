let nextRestaurantId, nextUserId;

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

query.getCurrentUserId()
  .then((result) => { nextUserId = result + 1; })
  .catch((err) => console.log('Error getting next user ID'));

query.getCurrentRestaurantId()
  .then((result) => { nextRestaurantId = result + 1; })
  .catch((err) => console.log('Error getting next user ID'));

app.post('/clicks', function (req, res) {
  console.log('GOT TO ENDPT');
  console.log('req body, ', req.body);
  let click = req.body;
  appendFile('./elasticsearch/logs.json', `{"user_id":${click.user_id},"restaurant_id":${click.restaurant_id},"query_id":${click.query_id},"time":${Date.now().toString()},"type":"click","stage":"start"}\n`)
    .catch((err) => console.log('error writing log to file ', err));

  query.addClick(req.body)
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
