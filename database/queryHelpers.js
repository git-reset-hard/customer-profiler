const db = require('./index');
const gen = require('../dataGeneration/generateData.js');

const getUserPreferences = function(userId) {
  let prefs = {};

  return db.User.findOne({
    where: {
      id: userId
    }
  })
    .then((result) => {
      prefs = {
        star_importance: result.dataValues.star_importance,
        proximity_importance: result.dataValues.proximity_importance,
        price_importance: result.dataValues.price_importance,
        restaurant_variance: result.dataValues.restaurant_variance
      };

      console.log(prefs);
    });
};

// getUserPreferences sample output:
// { star_importance: null,
//   proximity_importance: null,
//   price_importance: null,
//   restaurant_variance: null }

// db.sequelize.authenticate()
//   .then(() => {
//     console.log('creating user');
//     db.User.bulkCreate(gen.makeUserBatch(2));
//   })
//   .then(() => {
//     getUserPreferences(1);
//   });


// get user
// pass in obj with trait-value pairs
// update row with values
// const updateUserPreferences = function(userId, newPrefs) {
//   db.User.update({
//     where: {
//       id: userId
//     }
//   })
//   .then
// };



// retrieve restaurants that a user likes
// will be sent to rec. engine

// returns promise
// find all reviews by user
// filter by star ratings of 4 or 5
const getLikedRestaurants = function(userId) {
  return db.Reviews.findAll({
    attributes: ['id'],
    where: {
      userId: userId,
      // [Op.gte]
    }
  });
};

// makes user object to send to rec engine
const getUserInfo = function(userId) {
  let likedRestaurants, userInfo;

  return db.User.findOne({
    where: {
      id: userId
    }
  })
    .then((result) => {
      userInfo = result;
      getLikedRestaurants(userId);
    })
    .then((result) => {
      likedRestaurants = result;
    });

  // call formatting helper function
  // format and return all info
};

// const formatUserInfo = function(userRow, likedRestaurants) {

// }