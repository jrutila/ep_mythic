var eejs = require('ep_etherpad-lite/node/eejs/');
var settings = require('ep_etherpad-lite/node/utils/Settings');

//var clientIO = require('socket.io-client');
var mythicManager = require('./mythicManager');
var mythic = require('./mythic');

exports.eejsBlock_body = function(hook_name, args, cb) {
  args.content = 
      eejs.require('ep_mythic/templates/styles.html', {settings : false, content: args.content })
      + eejs.require('ep_mythic/templates/toolbar.ejs', {settings : false, content: args.content })
      + args.content
      + eejs.require('ep_mythic/templates/sidebar.ejs', {settings : false })
  return cb();
}

exports.eejsBlock_scripts = function(hook_name, args, cb) {
  //args.content = args.content + eejs.require('ep_mythic/templates/ui-js.ejs', { settings: false });
  return cb();
}

exports.socketio = function (hook_name, args, cb){
  var app = args.app;
  var io = args.io;
  var pushComment;
  var padComment = io;

  var commentSocket = io
  .of('/mythic')
  .on('connection', function (socket) {

    // Load engine
    socket.on('getMythic', function (data, callback) {
      var padId = data.padId;
      // Join to room
      socket.join(padId);
      mythicManager.getEngine(padId, function (err, engine){
        callback(engine);
      });
    });
    // Set engine
    socket.on('setMythic', function (data, callback) {
      var padId = data.padId;
      var engine = data.engine;
      mythicManager.setEngine(padId, engine, function (err){
        socket.broadcast.to(padId).emit('engineUpdate', engine);
        callback(err);
      });
    });
    
    socket.on('addThread', function(data, callback) {
      var padId = data.padId;
      var thread = { title: data.thread.title };
      mythicManager.addThread(padId, thread, function(threadId, thread) {
        socket.broadcast.to(padId).emit("threadAdd", { threadId: threadId, thread: thread });
        socket.emit("threadAdd", { threadId: threadId, thread: thread });
        callback(threadId, thread);
      });
    });
    
    socket.on('deleteThread', function(data, callback) {
      var padId = data.padId;
      var threadId = data.threadId;
      mythicManager.deleteThread(padId, threadId, function(threadId) {
        socket.broadcast.to(padId).emit("threadDelete", { threadId: threadId });
        socket.emit("threadDelete", { threadId: threadId });
        callback(threadId);
      });
    });
    
    socket.on('stopThread', function(data, callback) {
      var padId = data.padId;
      var threadId = data.threadId;
      var thread = { status: "passive" };
      mythicManager.editThread(padId, threadId, thread, function(threadId, thread) {
        socket.broadcast.to(padId).emit("threadUpdate", { threadId: threadId, thread: thread });
        socket.emit("threadUpdate", { threadId: threadId, thread: thread });
        callback(threadId, thread);
      });
    });
    
    socket.on('playThread', function(data, callback) {
      var padId = data.padId;
      var threadId = data.threadId;
      var thread = { status: "active" };
      mythicManager.editThread(padId, threadId, thread, function(threadId, thread) {
        socket.broadcast.to(padId).emit("threadUpdate", { threadId: threadId, thread: thread });
        socket.emit("threadUpdate", { threadId: threadId, thread: thread });
        callback(threadId, thread);
      });
    });
    
    socket.on('titleThread', function(data, callback) {
      var padId = data.padId;
      var threadId = data.threadId;
      var thread = { title: data.title };
      mythicManager.editThread(padId, threadId, thread, function(threadId, thread) {
        socket.broadcast.to(padId).emit("threadUpdate", { threadId: threadId, thread: thread });
        socket.emit("threadUpdate", { threadId: threadId, thread: thread });
        callback(threadId, thread);
      });
    });
  });
};