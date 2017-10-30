const helpers = require('./seedHelpers.js');
const query = require('../database/queryHelpers.js');

const makeRandomClick = function(maxUserId, maxRestaurantId) {
  return {
    user_id: helpers.randomizeRangeInclusive(0, maxUserId),
    restaurant_id: helpers.randomizeRangeInclusive(0, maxRestaurantId),
    query_id: helpers.randomizeRangeInclusive(0, 2000000)
  };
};

// console.log(makeRandomClick(40000, 50000));
setInterval(() => {
  query.addClick(makeRandomClick(40000, 50000));
}, 1000);