var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'https://search-profiler-ymu4wgxj7g2gs36easyccwukau.us-east-2.es.amazonaws.com',
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