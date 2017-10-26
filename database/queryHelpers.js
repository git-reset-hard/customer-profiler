const db = require('./index');

const getUserPreferences = function(userId) {
  db.User.findOne({
    where: {
      id: userId
    }
  })
    .then((result) => {
      // return pref fields here
    });


};

// get user
// pass in obj with trait-value pairs
// update row with values
const updateUserPreferences = function(userId, newPrefs) {

};



// retrieve restaurants that a user likes
// will be sent to rec. engine

// returns promise
const getLikedRestaurants = function(userId) {
  return db.Restaurants.findAll({
    attributes: ['id'],
    where: {
      userId: userId
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

const formatUserInfo = function(userRow, likedRestaurants) {

}