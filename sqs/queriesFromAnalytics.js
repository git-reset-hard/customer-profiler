const AWS = require('aws-sdk');
const config = require('../config/config.js');

AWS.config.loadFromPath('./config/config.json');

const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

const params = {
  QueueUrl: config.fromAnalytics,
  AttributeNames: [
    'SentTimestamp'
  ],
  MaxNumberOfMessages: 1,
  MessageAttributeNames: [
    'All'
  ],
  VisibilityTimeout: 0,
  WaitTimeSeconds: 0
};

sqs.receiveMessage(params, function(err, data) {
  if (err) {
    console.log('Error receiving message: ', err);
  } else {
    // (maybe) reformat data to fit into db
    // add to queries DB
    // generate clicks (can't reuse current helpers, need to constrain rests)
    // post clicks to HTTP

    var deleteParams = {
      QueueUrl: config.fromAnalytics,
      ReceiptHandle: data.Messages[0].ReceiptHandle // ???
    };

    sqs.deleteMessage(deleteParams, function(err, data) {
      if (err) {
        console.log('Delete Error', err);
      } else {
        console.log('Message Deleted', data);
      }
    });

    console.log('Received message', data.MessageId);
  }
});

module.exports = {

};