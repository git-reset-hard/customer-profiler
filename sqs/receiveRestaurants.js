const config = require('../config/config.js');
const AWS = require('aws-sdk');
AWS.config.loadFromPath('./config/config.json');
const Consumer = require('sqs-consumer');
const helpers = require('../dataGeneration/seedHelpers.js');
const queryHelpers = require('../database/queryHelpers.js');
const send = require('../sqs/sendData.js');


// SAMPLE OUTPUT OF MESSAGEBODY: 
// { name: 'Mohamed Sanford',
//   phone: '+14073900703',
//   yelpId: 'Mohamed-Sanford',
//   is_closed: false,
//   categories: [ 'pakistani', 'vegan', 'russian' ],
//   rating: 1,
//   city: 'EDMOND',
//   zipcode: '73025',
//   country: 'US',
//   state: 'OK',
//   latitude: '35.65',
//   longitude: '-97.47',
//   price: '2',
//   id: 704 }

// TARGET SCHEMA


const app = Consumer.create({
  queueUrl: config.restaurantsFromRestaurants,
  handleMessage: (message, done) => {
    let messageBody = JSON.parse(message.Body);
    console.log(messageBody);

    // done commented out so that messages are not deleted
    // done();
  },
  sqs: new AWS.SQS({apiVersion: '2012-11-05'})
});
 
app.on('error', (err) => {
  console.log(err.message);
});
 
app.start();
