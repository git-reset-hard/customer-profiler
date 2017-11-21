const helpers = require('./seedHelpers.js');
const query = require('../database/queryHelpers.js');
const config = require('../config/config.js');
const request = require('request');
const randomText = require('txtgen');

const sendTo = function(endpoint, generator, range, interval) {
  let object = generator.apply(this, range);
  request.post({
    url: config.host + `:${config.port}/${endpoint}`,
    json: true,
    body: object
  }, (err, res, body) => {
    if (err) {
      console.log(err);
    }
    setTimeout(() => sendTo(endpoint, generator, range, interval), interval);
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

const makeRandomReview = function (maxUserId, maxRestaurantId) {
  return {
    restaurant_id: helpers.randomizeRangeInclusive(0, maxRestaurantId),
    user_id: helpers.randomizeRangeInclusive(0, maxUserId),
    star_rating: helpers.randomizeRangeInclusive(1, 5),
    body: randomText.paragraph()
  };
};

module.exports = {
  sendTo,
  makeRandomClick,
  makeRandomCheckIn,
  makeRandomReview
};