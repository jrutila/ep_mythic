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

exports.setSettings = function(padId, settings, callback) {
  var self = this;
  db.get("mythic:" + padId, function(err, engine) {
    if (ERR(err, callback)) return;
    if (engine == null) return;
    
    if (engine.Settings == null) engine.Settings = {};
    engine.Settings['texttemplates'] = settings.texttemplates;
    self.setEngine(padId, engine, function(e) {
      callback(e.Settings);
    });
  });
}

exports.addThread = function(padId, thread, callback) {
  var thid = "t-" + randomString(8);
  var self = this;
  
  db.get("mythic:" + padId, function(err, engine) {
    if (ERR(err, callback)) return;
    if (engine == null) return;
    
    if (engine.Threads == null) engine.Threads = {};
    engine.Threads[thid] = thread;
    thread.status = "active";
    self.setEngine(padId, engine, function(e) {
      callback(thid, thread);
    });
  });
}

exports.addNpc = function(padId, npc, callback) {
  var nid = "n-" + randomString(8);
  var self = this;
  
  db.get("mythic:" + padId, function(err, engine) {
    if (ERR(err, callback)) return;
    if (engine == null) return;
    
    if (engine.Npcs == null) engine.Npcs = {};
    engine.Npcs[nid] = npc;
    self.setEngine(padId, engine, function(e) {
      callback(nid, npc);
    });
  });
}

exports.editNpc = function(padId, npcId, data, callback) {
  var thid = npcId;
  var self = this;
  
  db.get("mythic:" + padId, function(err, engine) {
    if (ERR(err, callback)) return;
    if (engine == null) return;
    
    if (engine.Npcs == null) return;
    var npc = engine.Npcs[thid];
    npc.title = data.title || npc.title;
    self.setEngine(padId, engine, function(e) {
      callback(thid, npc);
    });
  });
}

exports.deleteNpc = function(padId, npcId, callback) {
  var nid = npcId;
  var self = this;
  
  db.get("mythic:" + padId, function(err, engine) {
    if (ERR(err, callback)) return;
    if (engine == null) return;
    
    if (engine.Npcs == null) engine.Npcs = {};
    var npc = engine.Npcs[nid];
    npc.status = "deleted";
    self.setEngine(padId, engine, function(e) {
      callback(nid, npc);
    });
  });
}

exports.editThread = function(padId, threadId, data, callback) {
  var thid = threadId;
  var self = this;
  
  db.get("mythic:" + padId, function(err, engine) {
    if (ERR(err, callback)) return;
    if (engine == null) return;
    
    if (engine.Threads == null) return;
    var thread = engine.Threads[thid];
    thread.status = data.status || thread.status;
    thread.title = data.title || thread.title;
    self.setEngine(padId, engine, function(e) {
      callback(thid, thread);
    });
  });
}

exports.deleteThread = function(padId, threadId, callback) {
  var thid = threadId;
  var self = this;
  
  db.get("mythic:" + padId, function(err, engine) {
    if (ERR(err, callback)) return;
    if (engine == null) return;
    
    if (engine.Threads == null) return;
    var thread = engine.Threads[thid];
    thread.status = "deleted";
    self.setEngine(padId, engine, function(e) {
      callback(thid);
    });
  });
}