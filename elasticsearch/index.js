const config = require('../config/config.js');

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: config.elasticsearchHost,
  log: 'trace'
});

client.ping({
  requestTimeout: 30000,
}, function (error) {
  if (error) {
    console.error('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});

module.exports = {
  client
};