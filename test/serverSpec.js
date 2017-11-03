// TODO: find out what is keeping process running
// Note: server crashes when test aborted, double check if getting connection errors

const config = require('../config/config.js');
const expect = require('chai').expect;
// const db = require('./testingDatabase.js');
const request = require('request-promise');
const requestCallback = require('request'); // request-promise automatically rejected on HTTP error statuses
const testDB = require('./testingDatabase.js');

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
describe('Server', function () {
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

describe('Database Schema', function () {
  beforeEach((done) => {
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

// QUERY HELPERS
// should update user when a review is added
  // should add review content to user
  // should add stars
  // should recalculate preferences
  // should add distance
// should update user when a check-in is added
  // should add distance
  // should recalculate preferences