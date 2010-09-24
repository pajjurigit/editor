/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */


if (!require.def) require.def = require("requireJS-node")(module);

require.def("debug/WSV8DebuggerService",
    ["ace/lib/oop", "ace/MEventEmitter"],
    function(oop, MEventEmitter) {

var WSV8DebuggerService = function(socket) {
    this.$socket = socket;
    this.$attached = false;
};

(function() {

    oop.implement(this, MEventEmitter);

    this.attach = function(tabId, callback) {
        if (this.$attached)
            return callback(new Error("already attached!"));

        var self = this;

        this.$onMessage = function(data) {
            var message;
            try {
                message = JSON.parse(data);
            } catch(e) {
                return;
            }
            if (message.type == "node-debug-ready") {
                return callback();
            }
            else if (message.type == "node-debug") {
                self.$dispatchEvent("debugger_command_0", {data: message.body});
            }
        };

        this.$socket.on("message", this.$onMessage);
    };

    this.detach = function(tabId, callback) {
        this.$attached = false;
        this.$socket.removeListener("message", this.$onMessage);
        callback();
    };

    this.debuggerCommand = function(tabId, v8Command) {
        this.$socket.send(JSON.stringify({command: "debugNode", body: JSON.parse(v8Command)}));
    };

}).call(WSV8DebuggerService.prototype);

return WSV8DebuggerService;

});