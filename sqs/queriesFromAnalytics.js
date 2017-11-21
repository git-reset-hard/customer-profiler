const config = require('../config/config.js');
const AWS = require('aws-sdk');
AWS.config.loadFromPath('./config/config.json');
const Consumer = require('sqs-consumer');
const helpers = require('../dataGeneration/seedHelpers.js');


// SAMPLE OUTPUT: 
// { MessageId: '853623b3-514a-41e5-81a9-067fb53a3b93',
  // ReceiptHandle: 'AQEBdCb4Ef7pLwhG3skCFH/tJO97/wcJkk5b/AGYebtvs+IQVrnbaf1/VBODcITU/xZVK5z7O8hL5aEs7XVBDMTkVntT7Zgq01NSchI9i0AU7V9gz29CbCHZzCvWQcVw4JCbG0hgGux1p9J6Xd8iFgsGR2J0axvMrBLBk8frZEhlkVNYBgBWor55bC84qD4uOIsWsdXieW2DTKTDTwT/+p04yowaL6tBmDJ7OfyI8pc+MpKJL2nrmvLigrtCGGR5HvrlLtCZ0zI6DSwwFrS1c22499nJRDtb+X6sUWv8xsgXSwbKqA0FpHeOys/rzGja2FnvCRNnZL5EQ+zzMwc1IPXY9R02H8uSbnyCADci24mdSpCgKNsAYpex+Z5eMEqwsWTgK95ya9y9Txr3dMiV/wIhrQ==',
  // MD5OfBody: '51c37a8cf0512d36b0091d893d9fac91',
  // Body: '{"_id":"59fe360288e0c100109c3d68","userId":"3097157","searchTerm":"halal","location":"75040","date":"2017-07-09T19:14:48.653Z","isPersonalized":false,"queryID":"Sys0lUhoC-","__v":0,"list":["rkytKCLMV-CZ","S1ILHHKbNbAb","SJzbzwMM4ZR-","r1wBrncGNWC-","Bkg6nxeXNWAb","ryUNdSNW4Z0W","B1nfzUGW4-Ab","S1V5sPM-VZRW","B1CnVjQbVW0-","H1hM-l2QW4ZCW"]}' }

const app = Consumer.create({
  queueUrl: config.fromAnalytics,
  handleMessage: (message, done) => {
    let messageBody = JSON.parse(message.Body);

    console.log(message);
    let query = {
      _id: messageBody.id,
      search_term: messageBody.searchTerm,
      list_id: messageBody.servedList // receiving actual list of restaurants
    };
    // (maybe) reformat data to fit into db
    // add to queries DB
    // generate clicks (can't reuse current helpers, need to constrain rests)
    // post clicks to HTTP
    done();
  },
  sqs: new AWS.SQS({apiVersion: '2012-11-05'})
});
 
app.on('error', (err) => {
  console.log(err.message);
});
 
app.start();

// INCOMPLETE: finish after getting query format
const makeClicksFromQuery = function(query) {
  let clicks = [];
  let restaurants = [];
  // TODO: get list of restaurants
  // randomize number of clicks = n
  // randomize n restaurants

};