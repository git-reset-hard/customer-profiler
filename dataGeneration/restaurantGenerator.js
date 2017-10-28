const fs = require('fs');
const helpers = require('../helpers/helpers.js');

const writeRestaurants = function() {
  const writeStream = fs.createWriteStream('./data/seedRestaurants.txt', {flags: 'a'});

  for (var i = 0; i < 50000; i++) {
    writeStream.write(helpers.makeRandomRestaurant() + '|NOW()|NOW()\n');
  }

  writeStream.on('finish', () => {
    writeStream.close();
  });
};

writeRestaurants();