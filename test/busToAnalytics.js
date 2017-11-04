const AWS = require('aws-sdk');
const config = require('../config/config.js');

AWS.config.loadFromPath('./config/config.json');

const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

const testObj = {hello: 'world'};

const params = {
  DelaySeconds: 10,
  MessageBody: JSON.stringify(testObj),
  QueueUrl: config.toAnalytics
};

sqs.sendMessage(params, function(err, data) {
  if (err) {
    console.log('ERROR: ', err);
  } else {
    console.log('Posted message to queue', data.MessageId);
  }
});