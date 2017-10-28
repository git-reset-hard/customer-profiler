const fs = require('fs');
const helpers = require('../helpers/helpers.js');

const writeQueries = function() {
  const writeStream = fs.createWriteStream('./data/seedQueries.txt', {flags: 'a'});

  for (var i = 0; i < 1000000; i++) {
    writeStream.write(helpers.makeRandomQuery() + '|NOW()|NOW()\n');
  }

  writeStream.on('finish', () => {
    writeStream.close();
  });
};

writeQueries();