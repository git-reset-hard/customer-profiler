const config = require('../config/config.js');
const expect = require('chai').expect;
// const db = require('./testingDatabase.js');
const request = require('request-promise');
const requestCallback = require('request');

const click = {
  user_id: 1,
  restaurant_id: 2,
  query_id: 3
};

const badClick = {
  user_id: 10,
  restaurant_id: 20,
  query_id: null
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

describe('Server', function () {
  xit ('should return a 200 status on click POST', function() {
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


  xit ('should return a 200 status on checkin POST', function() {
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

  xit ('should return a 200 status on review POST', function() {
    request.post({
      url: config.host + `:${config.port}/reviews`,
      json: true,
      body: review,
      resolveWithFullResponse: true
    })
      .then((res) => {
        expect(res.statusCode).to.equal(200);
      });
  });

  it ('should reject an invalid click', function(done) {
    requestCallback.post({
      url: config.host + `:${config.port}/clicks`,
      json: true,
      body: badClick
    }, (err, res) => {
      expect(res.statusCode).to.equal(400);
      done();
    });
  });

  it ('should reject an invalid check-in', function(done) {
    requestCallback.post({
      url: config.host + `:${config.port}/checkins`,
      json: true,
      body: badCheckin
    }, (err, res) => {
      expect(res.statusCode).to.equal(400);
      done();
    });
  });

  it ('should reject an invalid review', function(done) {
    requestCallback.post({
      url: config.host + `:${config.port}/reviews`,
      json: true,
      body: badReview
    }, (err, res) => {
      expect(res.statusCode).to.equal(400);
      done();
    });
  });

});