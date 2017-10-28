const fs = require('fs');
const helpers = require('../dataGeneration/seedHelpers.js');

const writeClicks = function() {
  const writeStream = fs.createWriteStream('./data/seedClicks.json', {flags: 'a'});

  writeStream.write('[');
  for (var i = 0; i < 10000000; i++) {
    if (i) {
      writeStream.write(',');
    }
    writeStream.write(JSON.stringify(helpers.createClick(i)));
  }
  writeStream.write(']');

  writeStream.on('finish', () => {
    writeStream.close();
  });
};

writeClicks();