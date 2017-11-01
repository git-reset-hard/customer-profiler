const db = require('./index.js');
const es = require('../elasticsearch/index.js');
const dataHelpers = require('./dataProcessingHelpers.js');

const getUserProfile = function(userId) {
  return db.User.find({
    numId: userId
  });
};

const getRestaurantProfile = function(restId) {
  return db.Restaurant.find({
    numId: restId
  });
};

const updateUserPrefs = function(userId, star, distance, price, openness) {
  return db.User.update({
    numId: userId
  }, {
    $set: {
      star_pref: star,
      distance_pref: distance,
      price_pref: price,
      openness: openness
    }
  });
};

const updateSingleUserProperty = function(userId, property, value) {
  let options = {};
  options[property] = value;
  console.log(options);

  return db.User.update({
    numId: userId
  }, {
    $set: options
  })
    .then((result) => console.log('Updated: ', result));
};

const getLikedRestaurants = function(userId) {
  return db.Review.find({
    user_id: userId,
    star_rating: { $gt: 3 }
  });
};

const addUserTravelDistance = function(userId, distance) {
  return getUserProfile(userId)
    .then((result) => {
      let distances = (result[0].distances_traveled);
      distances.push(distance);
      console.log(distances);
      return updateSingleUserProperty(userId, 'distances_traveled', distances);
    })
    .then(() => {
      console.log('done');
    });
};

const addClick = function(click) {
  return db.Click.create(click)
    .then((result) => console.log('Added click to DB ', result))
    .catch((err) => { console.log('Error adding click to DB ', err); });
};

// add checkin to db
// look up rest. (save obj)
// look up user (save and manipulate obj)
// calc dist between user and address
// push distance into user distances_traveled
// push stars into ratings
// push price into prices
// recalculate prefs(stars, price, distance, openness)
// save to db
const addCheckIn = function(checkIn) {
  var restaurantProfile, userProfile;
  return db.CheckIn.create(checkIn)
    .then((result) => {
      console.log('Added check-in to DB ', result);
      return getRestaurantProfile(checkIn.restaurant_id);
    })
    .then((restaurant) => {
      restaurantProfile = restaurant[0];
      return getUserProfile(checkIn.user_id);
    })
    .then((user) => {
      userProfile = user[0];
      user.stars.push(restaurantProfile.rating);
      user.prices.push(restaurantProfile.priceRange);
      user.distances.push(dataHelpers.getDistance()) // TODO: not complete!
      ;
    })
    .catch((err) => console.log('Error adding check-in to DB ', err));
};

// getRestaurantProfile(1)
//   .then((restaurant) => {
//     console.log(restaurant);
//   });

const getCurrentUserId = function() {
  return db.User.count({});
};

const getCurrentRestaurantId = function() {
  return db.Restaurant.count({});
};
// addUserTravelDistance(5, 10)
//   .then((res) => console.log('done', res));

module.exports = {
  addClick,
  getCurrentUserId,
  getCurrentRestaurantId
};