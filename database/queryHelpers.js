const db = require('./index.js');
const es = require('../elasticsearch/index.js');

const getUserProfile = function(userId) {
  return db.User.find({
    numId: userId
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
  return db.CheckIn.create(checkIn)
    .then((result) => console.log('Added check-in to DB ', result))
    .catch((err) => console.log('Error adding check-in to DB ', err));
};

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