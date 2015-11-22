var mythicManager = require("./mythicManager");
var padManager = require("ep_etherpad-lite/node/db/PadManager");
var ERR = require("ep_etherpad-lite/node_modules/async-stacktrace");

exports.getPadMythic = function(padId, callback) {
    mythicManager.getEngine(padId, function (err, engine)
    {
        if(ERR(err, callback)) return;

        if(engine !== null) callback(null, engine);
    }); 
}