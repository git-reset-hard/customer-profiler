const helpers = require('./seedHelpers.js');
const query = require('../database/queryHelpers.js');
const config = require('../config/config.js');
const request = require('request');

const sendTo = function(endpoint, object) {
  console.log('SENDING REQ');
  console.log(JSON.stringify(object));
  request.post({
    url: config.host + `:${config.port}/${endpoint}`,
    json: true,
    body: object
  }, (err, res, body) => {
    console.log('ERROR HERE: ', err);
  });
};

const makeRandomClick = function(maxUserId, maxRestaurantId) {
  return {
    user_id: helpers.randomizeRangeInclusive(0, maxUserId),
    restaurant_id: helpers.randomizeRangeInclusive(0, maxRestaurantId),
    query_id: helpers.randomizeRangeInclusive(0, 2000000)
  };
};

const makeRandomCheckIn = function(maxUserId, maxRestaurantId) {
  return {
    user_id: helpers.randomizeRangeInclusive(0, maxUserId),
    restaurant_id: helpers.randomizeRangeInclusive(0, maxRestaurantId),
  };
};

// console.log(makeRandomClick(40000, 50000));
// setInterval(() => {
//   sendTo('clicks', makeRandomClick(40000, 50000));
// }, 1000);
sendTo('clicks', makeRandomClick(40000, 50000));
