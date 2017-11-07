const config = require('../config/config.js');
const AWS = require('aws-sdk');
AWS.config.loadFromPath('./config/config.json');
const Consumer = require('sqs-consumer');
const helpers = require('../dataGeneration/seedHelpers.js');
const queryHelpers = require('../database/queryHelpers.js');
const send = require('../sqs/sendData.js');


// SAMPLE OUTPUT: 
// {"rating":2,"dates":"2017-07-11T00:54:30.891Z","userId":327635,"restaurantId":1},{"rating":5,"dates":"2017-07-12T20:58:38.702Z","userId":123362,"restaurantId":1,"latitude":"37.74","longitude":"-83.06","zipcode":41465}]' }

// TARGET SCHEMA
//  restaurant_id: Number,
  // user_id: Number,
  // star_rating: Number,
  // time: { type: Date, default: Date.now },
  // body: String

const app = Consumer.create({
  queueUrl: config.reviewsFromRestaurants,
  handleMessage: (message, done) => {
    let messageBody = JSON.parse(message.Body);
    console.log(messageBody);
    // parse review here
    let review = {
      user_id: messageBody.userId,
      star_rating: messageBody.rating,
      time: messageBody.dates,
      body: 'PLACEHOLDER REPLACE ME'
    };

    // add review
    // queryHelpers.addReview(review);

    review.type = 'review';
    // send.sendData(review, 'toAnalytics');

    // done commented out so that messages are not deleted
    // done();
  },
  sqs: new AWS.SQS({apiVersion: '2012-11-05'})
});
 
app.on('error', (err) => {
  console.log(err.message);
});
 
app.start();
