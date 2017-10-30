const fs = require('fs');
const helpers = require('../dataGeneration/seedHelpers.js');

const writeUsers = function() {
  const writeStream = fs.createWriteStream('./data/seedUsers.json', {flags: 'a'});

  writeStream.write('[');
  for (var i = 0; i < 40000; i++) {
    if (i) {
      writeStream.write(',');
    }
    writeStream.write(JSON.stringify(helpers.createUser(i)));
  }
  writeStream.write(']');

  writeStream.on('finish', () => {
    writeStream.close();
  });
};

writeUsers();