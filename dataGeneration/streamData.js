const streamHelpers = require('./streamHelpers.js');
const maxUserId = 39999;
const maxRestId = 49999;
const interval = 1500;

streamHelpers.sendTo('reviews', streamHelpers.makeRandomReview, [maxUserId, maxRestId], interval);