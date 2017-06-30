'use strict';

//connect to mongo db
// Retrieve
var MongoClient = require('mongodb').MongoClient;

var _db;

module.exports = {

  connectToServer: function(callback) {
    MongoClient.connect('mongodb://roc:123321@ds145369.mlab.com:45369/acorndb2', function(err, db) {
      _db = db;
      return callback(err);
    });
  },

  getDB: function() {
    return _db;
  }

};
