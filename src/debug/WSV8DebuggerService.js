/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */


if (!require.def) require.def = require("requireJS-node")(module);

require.def("debug/WSV8DebuggerService",
    ["ace/lib/oop",
     "ace/lib/lang",
     "ace/MEventEmitter"
    ],
    function(oop, lang, MEventEmitter) {

var WSV8DebuggerService = function(socket) {
    this.$socket = socket;
    this.$state = "initialized";
    this.$onAttach = [];
};

(function() {

    oop.implement(this, MEventEmitter);

    this.attach = function(tabId, callback) {
        if (this.$state == "connected")
            return callback(new Error("already attached!"));

        this.$onAttach.push(callback);

        if (this.$state != "connected") {
            this.$socket.send(JSON.stringify({command: "DebugAttachNode"}));
            this.$socket.on("message", lang.bind(this.$onMessage, this));
            this.$state = "connecting";
        }
    };

    this.$onMessage = function(data) {
        var message;
        try {
            message = JSON.parse(data);
        } catch(e) {
            return;
        }
        if (message.type == "node-debug-ready") {
            this.$state = "connected";
            for (var i=0; i<this.$onAttach.length; i++)
                this.$onAttach[i]();
            this.$onAttach = [];
        }
        else if (message.type == "node-debug") {
            this.$dispatchEvent("debugger_command_0", {data: message.body});
        }
    };

    this.detach = function(tabId, callback) {
        this.$state = "initialized";
        this.$socket.removeListener("message", this.$onMessage);
        callback();
    };

    this.debuggerCommand = function(tabId, v8Command) {
        this.$socket.send(JSON.stringify({command: "debugNode", body: JSON.parse(v8Command)}));
    };

}).call(WSV8DebuggerService.prototype);

return WSV8DebuggerService;

});