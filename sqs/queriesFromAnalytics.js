const config = require('../config/config.js');
const AWS = require('aws-sdk');
AWS.config.loadFromPath('./config/config.json');
const Consumer = require('sqs-consumer');

const app = Consumer.create({
  queueUrl: config.fromAnalytics,
  handleMessage: (message, done) => {
    // (maybe) reformat data to fit into db
    // add to queries DB
    // generate clicks (can't reuse current helpers, need to constrain rests)
    // post clicks to HTTP
    done();
  },
  sqs: new AWS.SQS({apiVersion: '2012-11-05'})
});
 
app.on('error', (err) => {
  console.log(err.message);
});
 
app.start();