const fs = require('fs');
const helpers = require('../dataGeneration/seedHelpers.js');

const writeQueries = function() {
  const writeStream = fs.createWriteStream('./data/seedQueries.json', {flags: 'a'});

  writeStream.write('[');
  for (var i = 0; i < 2000000; i++) {
    if (i) {
      writeStream.write(',');
    }
    writeStream.write(JSON.stringify(helpers.createQuery(i)));
  }
  writeStream.write(']');

  writeStream.on('finish', () => {
    writeStream.close();
  });
};

writeQueries();