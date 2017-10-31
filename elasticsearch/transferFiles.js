const fs = require('fs');
const Promise = require('bluebird');
let logs, parsed;
let logsToSend = [];
var client = require('./index.js').client;

const read = Promise.promisify(fs.readFile);

read(__dirname + '/logs.json')
  .then((data) => {
    logs = data.toString().split('\n');

    logs.forEach((element) => {
      parsed = JSON.parse(element);
      logsToSend.push({ index: {_index: 'profiler', _type: parsed.type } });
      logsToSend.push(element);
    });
    
    return client.bulk({
      body: logsToSend
    });
  })
  .then(() => console.log('Sent logs to elasticsearch'))
  .catch((err) => console.log('Error sending logs to elasticsearch', err));
