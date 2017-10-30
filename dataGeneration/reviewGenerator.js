const fs = require('fs');
const helpers = require('../dataGeneration/seedHelpers.js');

const writeReviews = function() {
  const writeStream = fs.createWriteStream('./data/seedReviews.json', {flags: 'a'});

  writeStream.write('[');
  for (var i = 0; i < 50000; i++) {
    if (i) {
      writeStream.write(',');
    }
    writeStream.write(JSON.stringify(helpers.createReview(i)));
  }
  writeStream.write(']');

  writeStream.on('finish', () => {
    writeStream.close();
  });
};

writeReviews();