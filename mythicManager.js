var _ = require('ep_etherpad-lite/static/js/underscore');
var db = require('ep_etherpad-lite/node/db/DB').db;
var ERR = require("ep_etherpad-lite/node_modules/async-stacktrace");

exports.getEngine = function(padId, callback) {
  db.get("mythic:" + padId, function(err, engine)
  {
    if(ERR(err, callback)) return;
    //comment does not exists
    if(engine == null) engine = null;
    callback(null, { engine: engine });
  }); 
}

exports.setEngine = function(padId, engine, callback) {
    db.set("mythic:"+padId, engine);
    callback({});
}