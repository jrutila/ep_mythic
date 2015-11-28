var _, $, jQuery;
var $ = require('ep_etherpad-lite/static/js/rjquery').$;
var _ = require('ep_etherpad-lite/static/js/underscore');
var Mythic = require("ep_mythic/static/js/engine").engine;
var padeditor = require('ep_etherpad-lite/static/js/pad_editor').padeditor;

function ep_mythic(context) {
    var loc = document.location;
    var port = loc.port == "" ? (loc.protocol == "https:" ? 443 : 80) : loc.port;
    var url = loc.protocol + "//" + loc.hostname + ":" + port + "/" + "mythic";
    this.socket     = io.connect(url);
    
    this.padId      = clientVars.padId;
    
    this.initElements();
    
    this.init();
    
    this.listenEvents();
}

ep_mythic.prototype.initElements = function() {
    this.$toolbar = $("#mythic_toolbar");
    this.$start = $("#mythic_toolbar #startMythic");
    this.$ask = $("#mythic_toolbar #fate_b");
    this.$focus = $("#mythic_toolbar select[name='focus']");
    this.$fate = $("#mythic_toolbar select[name='fate']");
    this.$fateQ = $("#mythic_toolbar input[name='fate_q']");
    this.$chaos = $("#mythic_toolbar input[name='chaos']");
    this.$scene = $("#mythic_toolbar input[name='scene_n']");
    this.$newScene = $("#mythic_toolbar #scene_b");
    this.$sceneRoll = $("#mythic_toolbar #scene_r");
    this.$random = $("#mythic_toolbar #random_n");
    this.$newThread = $("#mythic_sidebar #newthread");
    this.$threads = $("#mythic_sidebar #threads");
    this.$newNPC = $("#mythic_sidebar #newnpc");
    this.$npcs = $("#mythic_sidebar #npcs");
}

ep_mythic.prototype.listenEvents = function() {
    var self = this;
    this.socket.on("engineUpdate", function(engine) {
        self.setEngine(engine);
    });
    this.socket.on("threadAdd", function(th) {
        self.threadAdd(th.thread, th.threadId);
    });
}

ep_mythic.prototype.writeText = function(text) {
    return padeditor.ace.callWithAce(function (ace) {
        var rep = ace.ace_getRep();
        var nl = rep.lines.length()-1;
        var w = Math.max(rep.lines.atIndex(nl).width-1, 0);
        rep.selStart = [nl, w];
        rep.selEnd = [nl, w];
        ace.ace_doReturnKey();
        ace.ace_replaceRange(rep.selStart, rep.selEnd, text);
        //ace.ace_replaceRange([nl,0], [nl,0], text);
        ace.ace_focus();
    }, "mythic");

}

ep_mythic.prototype.init = function() {
    var self = this;
    //self.engine = Mythic();
    self.loadEngine(function(eng) {
        _.each(eng.Threads, self.threadAdd, self);
        self.setEngine(eng);
    });
}

ep_mythic.prototype.loadEngine = function(callback) {
    var req = { padId: this.padId };

    this.socket.emit('getMythic', req, function (res){
        callback(res.engine);
    }); 
}

ep_mythic.prototype.saveEngine = function() {
    var req = { padId: this.padId, engine: this.engine };

    this.socket.emit('setMythic', req, function (res){
    }); 
}

ep_mythic.prototype.addThread = function(thread) {
    var req = { padId: this.padId, thread: thread };
    this.socket.emit('addThread', req, function(res) {
    });
}

ep_mythic.prototype.setEngine = function(eng) {
    if (eng instanceof Mythic) {
        this.engine = eng;
    } else {
        var engine = null;
        if (this.engine instanceof Mythic)
            engine = this.engine;
        else {
            engine = new Mythic(eng.fFocus);
            this.engine = engine;
        }
        
        engine.ChaosFactor = eng.ChaosFactor;
    }
    this.onEngineUpdate();
}

ep_mythic.prototype.threadAdd = function(thread, threadId) {
    var $li = $("<li class='thread'>"+thread+"<span class='buttonicons'></span></li>").attr("data-id", threadId);
    $li.insertBefore("#newthread");
}

// Override
ep_mythic.prototype.onEngineUpdate = function() {};

ep_mythic.prototype.fate = function(fDown) {
    return this.engine.roll(fDown, this.engine.ChaosFactor);
}

ep_mythic.prototype.setChaos = function(chaos) {
    var self = this;
    self.engine.setChaos(chaos);
}

ep_mythic.prototype.getChaos = function() {
    return this.engine.chaos;
}

var hooks = {
  // Init pad mythic
  postAceInit: function(hook, context){
    if(!pad.plugins) pad.plugins = {};
    var mythic = new ep_mythic(context);
    pad.plugins.ep_mythic = mythic;
    initUI();
  },
};

exports.postAceInit           = hooks.postAceInit;

function initUI() {
    var m = pad.plugins.ep_mythic;
    
    m.$start.click(function() {
        var focus = m.$focus.val();
        var engine = new Mythic(parseInt(focus));
        m.setEngine(engine);
        m.saveEngine();
    });
    
    m.$ask.click(function() {
        var f = m.fate(parseInt(m.$fate.val()));
        var f_text = m.$fate.find("option:selected").text();
        var q = m.$fateQ.val().trim();
        if (!q.endsWith("?"))
            q = q + "?";
        var doubles = "";
        var a = f[0];
        if (Math.floor(a/10) == a-Math.floor(a/10)*10)
            doubles = " DOUBLES!"
        var text = q + " (" + f_text + ") " + f[1] + " (Roll was: " + f[0] + doubles + ")";
        m.writeText(text);
        m.$fateQ.val("");
    });
    
    m.$chaos.change(function(val) {
        var c = parseInt($(val.currentTarget).val());
        m.setChaos(c);
        m.saveEngine();
        m.writeText("Chaos is now: "+c);
    });
    
    m.$newScene.click(function() {
		var scene = m.$scene.val().trim();
        m.writeText("Scene ##: "+ scene + "\n" + "scene start");
        m.$scene.val("");
    });
    
    m.$sceneRoll.click(function() {
		var rInt = Math.ceil(Math.random()*10);
		var alter = "";
		if (rInt <= m.engine.ChaosFactor)
		{
		    if (rInt % 2 == 0)
		        alter = "The scene is interrupted!";
		    else
		        alter = "The scene is altered!";
		    alter = "\n" + alter;
		}
        m.writeText(alter + "(Scene roll: "+rInt+")");
    });
    
    m.$newThread.keypress(function(e) {
        if (e.which == 13) { // Enter
            m.addThread(m.$newThread.val());
            m.$newThread.val("");
        }
    });
    
    m.$random.click(function() {
        m.writeText(m.engine.getRandom());
    });
    
    m.onEngineUpdate = function() {
        console.log("Updated engine to ");
        console.log(this.engine)
        if (this.engine == null)
        {
            this.$toolbar.addClass("start");
        } else {
            this.$toolbar.removeClass("start");
            this.$chaos.val(this.engine.ChaosFactor);
        }
    };
}