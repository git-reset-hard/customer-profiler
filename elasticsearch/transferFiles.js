const fs = require('fs');
const Promise = require('bluebird');
let logs, parsed;
let logsToSend = [];
const client = require('./index.js').client;
const filePath = __dirname + '/logs.json';


const read = Promise.promisify(fs.readFile);
const write = Promise.promisify(fs.writeFile);

read(filePath)
  .then((data) => {
    logs = data.toString().split('\n');

    logs.forEach((element, index) => {
      if (element) {
        parsed = JSON.parse(element);
        logsToSend.push({ index: {_index: 'profiler', _type: parsed.type } });
        logsToSend.push(element);
      }
    });

    console.log(logsToSend);
    
    return client.bulk({
      body: logsToSend
    });
  })
  .then(() => console.log('Sent logs to elasticsearch'))
  .then(() => write(filePath, ''))
  .catch((err) => console.log('Error sending logs to elasticsearch', err));
