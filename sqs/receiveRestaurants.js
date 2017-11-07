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
//   numId: Number,
//   latitude: Number,
//   longitude: Number,
//   priceRange: Number,
//   rating: Number,
//   categories: Array

let restaurants = [];
let count = 0;

const app = Consumer.create({
  queueUrl: config.restaurantsFromRestaurants,
  handleMessage: (message, done) => {
    // console.log('RUNNING');
    let messages = [];
    count++;
    console.log(count);
    let messageBody = JSON.parse(message.Body);

    messages.push(messageBody);
    messages.forEach((message) => {
      restaurants.push(formatRestaurant(message));
    });

    // console.log(restaurants);

    // console.log(formatRestaurant(restaurant));
    if (restaurants.length === 100) {
      app.stop();
      queryHelpers.addRestaurants(restaurants)
        .then(() => {
          console.log('added batch of length: ');
          restaurants = [];
          app.start();
        })
        .catch((err) => console.log('error adding restaurants ', err));
    }

    // add a listener for end of messages to get remainder < 100


    // done commented out so that messages are not deleted
    done();
  },
  sqs: new AWS.SQS({apiVersion: '2012-11-05'}),
  batchSize: 10,
  terminateVisibilityTimeout: true
});
 
app.on('error', (err) => {
  console.log(err.message);
});

app.on('empty', () => {
  console.log('queue empty');
  queryHelpers.addRestaurants(restaurants)
    .then(() => {
      console.log('added final batch');
    })
    .catch((err) => console.log(err));
});
 
app.start();

const formatRestaurant = function(restaurant) {
  return {
    numId: restaurant.id,
    latitude: Number(restaurant.latitude),
    longitude: Number(restaurant.longitude),
    priceRange: Number(restaurant.price),
    rating: restaurant.rating,
    categories: restaurant.categories 
  };
};
