const fs = require('fs');
const helpers = require('../dataGeneration/seedHelpers.js');
const NUM_OF_USERS = 500000;
const batch1 = 100000;
const batch2 = 200000;
const batch3 = 300000;
const batch4 = 400000;
const batch5 = 500000;

const sqs = require('../sqs/sendData.js');

const writeUsers = function() {
  const writeStream = fs.createWriteStream('./data/seedUsers.json', {flags: 'a'});
  const elasticWriteStream = fs.createWriteStream('./data/elasticData/elasticSeedUsers.json', {flags: 'a'});

  // REMOVE BRACKETS IF BATCHING!!!
  writeStream.write('[');
  for (var i = batch4; i < batch5; i++) {
    let newUser = helpers.createUser(i);

    if (i) {
      writeStream.write(',');
    }

    elasticWriteStream.write(`{"user_id":${i},"gets_recommendations":${newUser.gets_recommendations},"type":"user","time":"${Date.now()}"}`);

    if (i < NUM_OF_USERS - 1) {
      elasticWriteStream.write('\n');
    }

    writeStream.write(JSON.stringify(newUser));
    sqs.sendData(newUser, 'usersToAnalytics');
  }
  writeStream.write(']');

  writeStream.on('finish', () => {
    writeStream.close();
  });
};

writeUsers();
