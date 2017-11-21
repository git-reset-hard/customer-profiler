const fs = require('fs');
const helpers = require('../dataGeneration/seedHelpers.js');

const writeCheckIns = function() {
  const writeStream = fs.createWriteStream('./data/seedCheckIns.json', {flags: 'a'});

  writeStream.write('[');
  for (var i = 0; i < 200000; i++) {
    if (i) {
      writeStream.write(',');
    }
    writeStream.write(JSON.stringify(helpers.createCheckIn(i)));
  }
  writeStream.write(']');

  writeStream.on('finish', () => {
    writeStream.close();
  });
};

writeCheckIns();