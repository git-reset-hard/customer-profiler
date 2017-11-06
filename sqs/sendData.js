const AWS = require('aws-sdk');
const config = require('../config/config.js');

AWS.config.loadFromPath('./config/config.json');

const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

// takes data obj
const sendData = function(data, queue) {
  // console.log('Data: ' + data + 'URL: ' + config[queue]);
  const params = {
    DelaySeconds: 10,
    MessageBody: JSON.stringify(data),
    QueueUrl: config[queue]
  };

  sqs.sendMessage(params, function(err, data) {
    if (err) {
      console.log('ERROR: ', err);
    } else {
      // console.log('Posted message to queue', data.MessageId);
    }
  });
};

module.exports = {
  sendData
};