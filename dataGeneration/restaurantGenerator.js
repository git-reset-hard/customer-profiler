const fs = require('fs');
const helpers = require('../dataGeneration/seedHelpers.js');

const writeRestaurants = function() {
  const writeStream = fs.createWriteStream('./data/seedRestaurants.json', {flags: 'a'});

  writeStream.write('[');
  for (var i = 0; i < 50000; i++) {
    if (i) {
      writeStream.write(',');
    }
    writeStream.write(JSON.stringify(helpers.createRestaurant(i)));
  }
  writeStream.write(']');

  writeStream.on('finish', () => {
    writeStream.close();
  });
};

writeRestaurants();