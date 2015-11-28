var _ = require('ep_etherpad-lite/static/js/underscore');
var db = require('ep_etherpad-lite/node/db/DB').db;
var ERR = require("ep_etherpad-lite/node_modules/async-stacktrace");
var randomString = require('ep_etherpad-lite/static/js/pad_utils').randomString;

exports.getEngine = function(padId, callback) {
  db.get("mythic:" + padId, function(err, engine) {
    if (ERR(err, callback)) return;
    if (engine == null) engine = null;
    callback(null, {
      engine: engine
    });
  });
}

exports.setEngine = function(padId, engine, callback) {
  db.set("mythic:" + padId, engine);
  callback(engine);
}

exports.addThread = function(padId, thread, callback) {
  var thid = "t-" + randomString(8);
  var self = this;
  
  db.get("mythic:" + padId, function(err, engine) {
    if (ERR(err, callback)) return;
    if (engine == null) return;
    
    if (engine.Threads == null) engine.Threads = {};
    engine.Threads[thid] = thread;
    self.setEngine(padId, engine, function(e) {
      callback(thid, thread);
    });
  });
}