// TODO: find out what is keeping process running
// Note: server crashes when test aborted, double check if getting connection errors

// Mongoose cannot connect to two diff databases; cannot run all tests at once
// To run Database tests: uncomment testDB, comment out query
// To run Query Helpers tests: do opposite

const config = require('../config/config.js');
const expect = require('chai').expect;// const db = require('./testingDatabase.js');
const query = require('../database/queryHelpers.js');
const request = require('request-promise');
const requestCallback = require('request'); // request-promise automatically rejected on HTTP error statuses
// const testDB = require('./testingDatabase.js');
let deleteID;

const click = {
  user_id: 1,
  restaurant_id: 2,
  query_id: 3
};

const badClick = {
  user_id: 10,
  restaurant_id: 20
};

const checkin = {
  user_id: 4,
  restaurant_id: 5
};

const badCheckin = {
  user_id: null,
  restaurant_id: 5
};

const review = {
  user_id: 6,
  restaurant_id: 7,
  star_rating: 5,
  body: 'Best fried giraffe ever'
};

const badReview = {
  user_id: 6,
  restaurant_id: 7,
  star_rating: null,
  body: 'Best fried giraffe ever'
};

// should log to file
xdescribe('Server', function () {
  it ('should return a 200 status on click POST', function() {
    return request.post({
      url: config.host + `:${config.port}/clicks`,
      json: true,
      body: click,
      resolveWithFullResponse: true
    })
      .then((res) => {
        expect(res.statusCode).to.equal(200);
      });
  });


  it ('should return a 200 status on checkin POST', function() {
    return request.post({
      url: config.host + `:${config.port}/checkins`,
      json: true,
      body: checkin,
      resolveWithFullResponse: true
    })
      .then((res) => {
        expect(res.statusCode).to.equal(200);
      });
  });

  it ('should return a 200 status on review POST', function() {
    return request.post({
      url: config.host + `:${config.port}/reviews`,
      json: true,
      body: review,
      resolveWithFullResponse: true
    })
      .then((res) => {
        expect(res.statusCode).to.equal(200);
      });
  });

  it ('should reject an invalid click', function() {
    return request.post({
      url: config.host + `:${config.port}/clicks`,
      json: true,
      body: badClick,
      resolveWithFullResponse: true
    })
      .then((res) => {
        expect(res.statusCode).to.equal(400);
      })
      .catch((err) => {
        expect(err.statusCode).to.equal(400);
      });
  });

  it ('should reject an invalid check-in', function() {
    return request.post({
      url: config.host + `:${config.port}/checkins`,
      json: true,
      body: badCheckin,
      resolveWithFullResponse: true
    })
      .then((res) => {
        expect(res.statusCode).to.equal(400);
      })
      .catch((err) => {
        expect(err.statusCode).to.equal(400);
      });
  });

  it ('should reject an invalid review', function() {
    return request.post({
      url: config.host + `:${config.port}/reviews`,
      json: true,
      body: badReview,
      resolveWithFullResponse: true
    })
      .then((res) => {
        expect(res.statusCode).to.equal(400);
      })
      .catch((err) => {
        expect(err.statusCode).to.equal(400);
      });
  }); 

  
});

xdescribe('Database Schema', function () {
  before((done) => {
    testDB.db.db.dropDatabase(done);
  });

  it ('should insert a click into database', function() {
    return testDB.Click.create(click)
      .then((result) => {
        expect(result.user_id).to.equal(1);
        expect(result.restaurant_id).to.equal(2);
        expect(result.query_id).to.equal(3);
      });
  });

  it ('should insert a check-in into database', function() {
    return testDB.CheckIn.create(checkin)
      .then((result) => {
        expect(result.user_id).to.equal(4);
        expect(result.restaurant_id).to.equal(5);
      });
  });

  it ('should insert a review into database', function() {
    return testDB.Review.create(review)
      .then((result) => {
        expect(result.user_id).to.equal(6);
        expect(result.restaurant_id).to.equal(7);
        expect(result.star_rating).to.equal(5);
      });
  });
});

describe('Query Helpers', function () {
  const testId = 99999999;
  const goodRestId = testId;
  const badRestId = testId + 1;

  const user = {
    numId: testId,
    name: 'Fred X.',
    gets_recommendations: true,
    distances_traveled: [],
    star_pref: null,
    distance_pref: null,
    price_pref: null,
    stars: [],
    reviews: '',
    prices: [],
    liked_restaurants: [],
    latitude: 37.773972,
    longitude: -122.431297,
    hometown_city: 'San Francisco, CA',
    openness: .9,
    conscientiousness: .8,
    achievement: .7,
    extraversion: .6,
    agreeableness: .1
  };

  const goodRestaurant = {
    numId: goodRestId,
    latitude: 37.773975,
    longitude: -122.0,
    priceRange: 1,
    rating: 5,
    categories: ['Sushi']
  };

  const goodReview = {
    restaurant_id: goodRestId,
    user_id: testId,
    star_rating: 5,
    body: 'Best meal since sliced bread'
  };

  const badRestaurant = {
    numId: badRestId,
    latitude: 37.6,
    longitude: -122.3,
    priceRange: 1,
    rating: 1.5,
    categories: ['Deli']
  };

  const badReview = {
    restaurant_id: badRestId,
    user_id: testId,
    star_rating: 1,
    body: 'What did I even eat'
  };


  after(() => {
    query.User.remove({numId: testId})
      .then(() => query.Restaurant.remove({numId: testId}));
  });

  it ('should retrieve a user from database', function() {
    return query.User.create(user)
      .then((result) => {
        return query.getUserProfile(testId);
      })
      .then((result) => {
        expect(result[0].name).to.equal('Fred X.');
      });
  });

  it ('should retrieve a restaurant from database', function() {
    return query.Restaurant.create(goodRestaurant)
      .then((result) => {
        return query.getRestaurantProfile(testId);
      })
      .then((result) => {
        expect(result[0].latitude).to.equal(37.773975);
        expect(result[0].longitude).to.equal(-122.0);
      });
  });

  it ('should edit user preferences when a review is created', function() {
    return query.addReview(goodReview)
      .then(() => {
        return query.getUserProfile(testId);
      })
      .then((user) => {
        console.log(user[0]);
        expect(user[0].stars[0]).to.equal(5);
        expect(user[0].star_pref).to.equal(1);
        expect(user[0].distances_traveled[0]).to.exist;
        expect(user[0].distance_pref).to.equal(0);
        expect(user[0].prices[0]).to.equal(1);
        expect(user[0].price_pref[0]).to.equal(0); // need to fix this calc
      });
  });


});

// QUERY HELPERS
// should update user when a review is added
  // should add review content to user
  // should add stars
  // should recalculate preferences
  // should add distance
// should update user when a check-in is added
  // should add distance
  // should recalculate preferences