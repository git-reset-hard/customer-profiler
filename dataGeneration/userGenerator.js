const fs = require('fs');
const helpers = require('../dataGeneration/seedHelpers.js');
const NUM_OF_USERS = 500000;
const sqs = require('../sqs/sendData.js');

const writeUsers = function() {
  const writeStream = fs.createWriteStream('./data/seedUsers.json', {flags: 'a'});
  const elasticWriteStream = fs.createWriteStream('./data/elasticData/elasticSeedUsers.json', {flags: 'a'});

  writeStream.write('[');
  for (var i = 0; i < NUM_OF_USERS; i++) {
    let newUser = helpers.createUser(i);

    if (i) {
      writeStream.write(',');
    }

    elasticWriteStream.write(`{"user_id":${i},"gets_recommendations":${newUser.gets_recommendations},"type":"user","time":"${Date.now()}"}`);

    if (i < NUM_OF_USERS - 1) {
      elasticWriteStream.write('\n');
    }

    writeStream.write(JSON.stringify(newUser));
    // sqs.sendData(newUser, 'toRestaurantProfiler');
  }
  writeStream.write(']');

  writeStream.on('finish', () => {
    writeStream.close();
  });
};

writeUsers();
