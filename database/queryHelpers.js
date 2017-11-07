const config = require('../config/config.js');
const db = require('./index.js');
const es = require('../elasticsearch/index.js');
const dataHelpers = require('./dataProcessingHelpers.js');
const sqs = require('../sqs/sendData.js');
var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
 
var personality_insights = new PersonalityInsightsV3({
  username: config.watsonUser,
  password: config.watsonPassword,
  version_date: '2016-10-19'
});

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

const updateUserProperties = function(userId, properties) {
  console.log(`updating user ${userId} with properties ${JSON.stringify(properties)}`);
  return db.User.findOneAndUpdate({
    numId: userId
  }, {
    $set: properties
  }, {
    returnNewDocument: true
  })
    .then((result) => {
      console.log('Updated: ', result);
      // sqs.sendData(result, 'toRestaurantProfiler');
      sqs.sendData(result, 'toRecommender');
    });
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
  if (Array.isArray(click)) {
    return db.Click.insertMany(click)
      .then((result) => console.log('Added batch of clicks to DB ', result))
      .catch((err) => { console.log('Error adding click to DB ', err); }); // remove logging when adding whole batch
  } 

  return db.Click.create(click)
    .then((result) => console.log('Added click to DB ', result))
    .catch((err) => { console.log('Error adding click to DB ', err); });
};

// adds to DB, updates user prefs
const addCheckIn = function(checkIn) {
  let restaurantProfile, userProfile; 
  let updatedUser = {};
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
      console.log(userProfile);
      console.log(restaurantProfile);

      updatedUser = {
        stars: userProfile.stars.concat(restaurantProfile.rating),
        prices: userProfile.prices.concat(restaurantProfile.priceRange),
        distances_traveled: userProfile.distances_traveled.concat(
          dataHelpers.calcDistance(
            dataHelpers.formatCoordsToObj(userProfile.latitude, userProfile.longitude),
            dataHelpers.formatCoordsToObj(restaurantProfile.latitude, restaurantProfile.longitude)
          )
        )
      };
      
      updatedUser.star_pref = dataHelpers.calcNormalizedAvg(updatedUser.stars, 'star');
      updatedUser.price_pref = dataHelpers.calcNormalizedAvg(updatedUser.prices, 'price');
      updatedUser.distance_pref = dataHelpers.calcNormalizedAvg(updatedUser.distances_traveled, 'distance');

      return updateUserProperties(userProfile.numId, updatedUser);
    })
    .then(() => {
      console.log('Added check-in to DB; user prefs updated');
    })
    .catch((err) => console.log('Error adding check-in to DB ', err));
};

const addReview = function(review) {
  let restaurantProfile, userProfile; 
  let updatedUser = {};
  return db.Review.create(review)
    .then((result) => {
      console.log('Added review to DB ', result);
      return getRestaurantProfile(review.restaurant_id);
    })
    .then((restaurant) => {
      restaurantProfile = restaurant[0];
      return getUserProfile(review.user_id);
    })
    .then((user) => {
      userProfile = user[0];
      console.log(userProfile);
      console.log(restaurantProfile);

      updatedUser = {
        stars: userProfile.stars.concat(restaurantProfile.rating),
        prices: userProfile.prices.concat(restaurantProfile.priceRange),
        distances_traveled: userProfile.distances_traveled.concat(
          dataHelpers.calcDistance(
            dataHelpers.formatCoordsToObj(userProfile.latitude, userProfile.longitude),
            dataHelpers.formatCoordsToObj(restaurantProfile.latitude, restaurantProfile.longitude)
          )
        ),
        reviews: userProfile.reviews + '\n' + review.body
      };
      
      if (review.star_rating >= 4) {
        updatedUser.liked_restaurants = userProfile.liked_restaurants.concat([restaurantProfile.numId]);
      }

      updatedUser.star_pref = dataHelpers.calcNormalizedAvg(updatedUser.stars, 'star');
      updatedUser.price_pref = dataHelpers.calcNormalizedAvg(updatedUser.prices, 'price');
      updatedUser.distance_pref = dataHelpers.calcNormalizedAvg(updatedUser.distances_traveled, 'distance');
      // watson call here (before update)
      Object.assign(updatedUser, fakeCalcPersonality(updatedUser.reviews));
      // pass in reviews property (updatedUser.reviews)
      return updateUserProperties(userProfile.numId, updatedUser);
    })

    .then((result) => {
      console.log('Added review to DB; user prefs updated');

    })
    .catch((err) => console.log('Error adding check-in to DB ', err));
};

const calcPersonality = function(reviews) {
  personality_insights.profile({
    text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using , making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).',
    consumption_preferences: true
  },
  function (err, response) {
    if (err) {
      console.log('error:', err);
    } else {
      console.log(JSON.stringify(response, null, 2));
    }
  });
};

// returns fake data from watson to subvert limited api calls
const fakeCalcPersonality = function(reviews) {
  return {
    openness: Math.random(),
    conscientiousness: Math.random(),
    achievement: Math.random(),
    extraversion: Math.random(),
    agreeableness: Math.random()
  };
};

const addQuery = function(query) {
  return db.Query.create(query);
};

// addReview({
//   user_id: 59,
//   restaurant_id: 60,
//   star_rating: 3,
//   body: 'this was a good restaurant'
// });

const getCurrentUserId = function() {
  return db.User.count({});
};

const getCurrentRestaurantId = function() {
  return db.Restaurant.count({});
};

module.exports = {
  addClick,
  getCurrentUserId,
  getCurrentRestaurantId,
  addReview,
  addCheckIn,
  User: db.User,
  Restaurant: db.Restaurant,
  getUserProfile,
  getRestaurantProfile,
  Review: db.Review
};