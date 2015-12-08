var _, $, jQuery;
var $ = require('ep_etherpad-lite/static/js/rjquery').$;
var _ = require('ep_etherpad-lite/static/js/underscore');
var Mythic = require("ep_mythic/static/js/engine").engine;
var padeditor = require('ep_etherpad-lite/static/js/pad_editor').padeditor;
var sprintf = require("ep_mythic/static/js/lib/sprintf.min").sprintf;

var SCENE = 0;
var QUESTION = 1;
var CHAOS_UP = 2;
var CHAOS_DOWN = 3;
var FOCUS = 4;
var INTERRUPTED = 5;
var ALTERED = 6;
var SCENE_ROLL = 7;

function template(i) {
  return $("#mythic-texttemplates").val().split("\n")[i];
}

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
    this.$focus = $("#mythic_toolbar #focus_n");
    this.$newThread = $("#mythic_sidebar #newthread");
    this.$newNpc = $("#mythic_sidebar #newnpc");
    this.$threads = $("#mythic_sidebar #threads");
    this.$newNPC = $("#mythic_sidebar #newnpc");
    this.$npcs = $("#mythic_sidebar #npcs");
    this.sel_input = ".thread input, .npc input";
    this.sel_title = "#mythic_sidebar .title";
    this.$settings_templates = $("#mythic-texttemplates");
}

ep_mythic.prototype.listenEvents = function() {
    var self = this;
    this.socket.on("engineUpdate", function(engine) {
        self.setEngine(engine);
    });
    this.socket.on("settingsUpdate", function(settings) {
        self.setSettings(settings);
    });
    this.socket.on("threadAdd", function(th) {
        self.threadAdd(th.thread, th.threadId);
    });
    this.socket.on("threadUpdate", function(th) {
        self.threadUpdate(th.thread, th.threadId);
    });
    this.socket.on("threadDelete", function(th) {
        self.threadDelete(th.threadId);
    });
    this.socket.on("npcAdd", function(th) {
        self.npcAdd(th.npc, th.npcId);
    });
    this.socket.on("npcUpdate", function(th) {
        self.npcUpdate(th.npc, th.npcId);
    });
    this.socket.on("npcDelete", function(th) {
        self.npcDelete(th.npcId);
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
        if (eng) {
            eng.Threads && _.each(eng.Threads, self.threadAdd, self);
            eng.Npcs && _.each(eng.Npcs, self.npcAdd, self);
            self.setEngine(eng);
        }
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

ep_mythic.prototype.saveSettings = function() {
    var req = { padId: this.padId, settings: { texttemplates: this.$settings_templates.val() }};
    
    this.socket.emit('saveSettings', req, function(res) {
    });
}

ep_mythic.prototype.addThread = function(thread) {
    if (typeof(thread) == "string")
        thread = { title: thread }
    var req = { padId: this.padId, thread: thread };
    this.socket.emit('addThread', req, function(res) {
    });
}

ep_mythic.prototype.addNpc = function(npc) {
    if (typeof(npc) == "string")
        npc = { title: npc }
    var req = { padId: this.padId, npc: npc };
    this.socket.emit('addNpc', req, function(res) {
    });
}

ep_mythic.prototype.editNpc = function(npcId, newTitle) {
    var req = { padId: this.padId, npcId: npcId, title: newTitle };
    this.socket.emit('titleNpc', req, function(res, thread) {
    });
}
ep_mythic.prototype.deleteNpc = function(npcId) {
    var req = { padId: this.padId, npcId: npcId };
    this.socket.emit('deleteNpc', req, function(res, thread) {
    });
}

ep_mythic.prototype.editThread = function(threadId, newTitle) {
    var req = { padId: this.padId, threadId: threadId, title: newTitle };
    this.socket.emit('titleThread', req, function(res, thread) {
    });
}

ep_mythic.prototype.stopThread = function(threadId) {
    var req = { padId: this.padId, threadId: threadId };
    this.socket.emit('stopThread', req, function(res, thread) {
    });
}

ep_mythic.prototype.deleteThread = function(threadId) {
    var req = { padId: this.padId, threadId: threadId };
    this.socket.emit('deleteThread', req, function(res, thread) {
    });
}

ep_mythic.prototype.playThread = function(threadId) {
    var req = { padId: this.padId, threadId: threadId };
    this.socket.emit('playThread', req, function(res, thread) {
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
        engine.Settings = eng.Settings;
    }
    this.onEngineUpdate();
}

ep_mythic.prototype.setSettings = function(settings) {
    this.$settings_templates.val(settings.texttemplates);
}

ep_mythic.prototype._$thread = function(thread, threadId) {
    var action = "stop";
    if (thread.status == "passive")
        action = "play";
    // TODO: To some template engine, please
    return $("<li class='thread "+thread.status+"'><span class='title'>"+thread.title+"</span><input type='text' value='"+thread.title+"'/>\
    <div class='control'><span class='thread_control "+action+"'></span><span class='thread_control delete'></span></div></li>").attr("data-id", threadId);
}

ep_mythic.prototype._$npc = function(npc, npcId) {
    // TODO: To some template engine, please
    return $("<li class='npc'><span class='title'>"+npc.title+"</span><input type='text' value='"+npc.title+"'/>\
    <div class='control'><span class='thread_control delete'></span></div></li>").attr("data-id", npcId);
}

ep_mythic.prototype.threadAdd = function(thread, threadId) {
    if (thread.status == "deleted") return;
    var $li = this._$thread(thread, threadId);
    var $nth = $("#newthread").parent();
    $li.insertBefore($nth);
}
ep_mythic.prototype.threadUpdate = function(thread, threadId) {
    var $li = $(".thread[data-id='"+threadId+"']");
    var $new = this._$thread(thread, threadId);
    $li.replaceWith($new);
}
ep_mythic.prototype.threadDelete = function(threadId) {
    var $li = $(".thread[data-id='"+threadId+"']");
    $li.remove();
}

// NPCs
ep_mythic.prototype.npcAdd = function(npc, npcId) {
    if (npc.status == "deleted") return;
    var $li = this._$npc(npc, npcId);
    var $nth = $("#newnpc").parent();
    $li.insertBefore($nth);
}
ep_mythic.prototype.npcUpdate = function(npc, npcId) {
    var $li = $(".npc[data-id='"+npcId+"']");
    var $new = this._$npc(npc, npcId);
    $li.replaceWith($new);
}
ep_mythic.prototype.npcDelete = function(npcId) {
    var $li = $(".npc[data-id='"+npcId+"']");
    $li.remove();
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
            
        var tmpl = template(QUESTION);
        var v = { question: q, possibility: f_text, result: f[1], roll: f[0], doubles: doubles };
        var text = sprintf(tmpl, v);
        m.writeText(text);
        m.$fateQ.val("");
    });
    
    $(document).on("click", "#mythic_sidebar .thread_control", function(th) {
        var $trg = $(th.target);
        var $par = $trg.parents("li");
        var thId = $par.attr("data-id");
        if ($trg.is(".stop"))
            m.stopThread(thId);
        else if ($trg.is(".play"))
            m.playThread(thId);
        else if ($trg.is(".delete"))
            if ($par.is(".thread"))
                m.deleteThread(thId);
            else if ($par.is(".npc"))
                m.deleteNpc(thId);
    });
    
    m.$settings_templates.change(function() {
        m.saveSettings();
    });
    
    
    m.$chaos.change(function(val) {
        var origChaos = m.engine.ChaosFactor;
        var c = parseInt($(val.currentTarget).val());
        m.setChaos(c);
        m.saveEngine();
        var chaosText = "%(chaos)d";
        if (origChaos < c)
            chaosText = template(CHAOS_UP);
        if (origChaos > c)
            chaosText = template(CHAOS_DOWN);
        m.writeText(sprintf(chaosText, { chaos: c }));
    });
    
    m.$newScene.click(function() {
		var scene = m.$scene.val().trim();
        var sceneText = template(SCENE);
        m.writeText(sprintf(sceneText, { number: 0, title: scene }));
        m.$scene.val("");
    });
    
    m.$sceneRoll.click(function() {
		var rInt = Math.ceil(Math.random()*10);
		var alter = template(SCENE_ROLL);
		if (rInt <= m.engine.ChaosFactor)
		{
		    if (rInt % 2 == 0)
                alter = template(INTERRUPTED);
		    else
                alter = template(ALTERED);
		    alter = "\n" + alter;
		}
        m.writeText(sprintf(alter, { roll: rInt }));
    });
    
    m.$newThread.keypress(function(e) {
        if (e.which == 13) { // Enter
            m.addThread(m.$newThread.val());
            m.$newThread.val("");
        }
    });
    
    m.$newNpc.keypress(function(e) {
        if (e.which == 13) { // Enter
            m.addNpc(m.$newNpc.val());
            m.$newNpc.val("");
        }
    });
    
    $(document).on("keypress", m.sel_input, function(th) {
        if (th.which == 13) { // Enter
            var $trg = $(th.target);
            var thId = $trg.parents("li").attr("data-id");
            // Edit thread title
            if ($trg.parents("li").is(".thread"))
                m.editThread(thId, $trg.val());
            else if ($trg.parents("li").is(".npc"))
                m.editNpc(thId, $trg.val());
        }
    });
    
    $(document).on("click", m.sel_title, function(th) {
        var $trg = $(th.target);
        if ($trg.parents("li").is(":not(.passive)"))
            $trg.parents("li").addClass("editing");
    });
    
    m.$random.click(function() {
        m.writeText(m.engine.getRandom());
    });
    
    m.$focus.click(function() {
		var rInt = Math.ceil(Math.random()*100);
		var fText = m.engine.getFocus(rInt);
		var focusText = template(FOCUS);
		m.writeText(sprintf(focusText, { focus: fText, roll: rInt }));
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
            if (this.engine.Settings)
                this.setSettings(this.engine.Settings);
        }
    };
}