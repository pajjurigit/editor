/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */
require.def("debug/WebSocketV8DebuggerService",
    ["ace/ace", "ace/MEventEmitter"],
    function(ace, MEventEmitter) {

var WebSocketV8DebuggerService = function(socket) {
    this.$socket = socket;
    this.$attached = false;
};

(function() {

    ace.implement(this, MEventEmitter);

    this.attach = function(tabId, callback) {
        if (this.$attached)
            return callback(new Error("already attached!"));

        var self = this;
        this.$socket.on("message", function(data) {
//            console.log("RECEIVE:", data);
            var message = JSON.parse(data);
            if (message.type == "debug-ready")
                return callback();
            else if (message.type == "debug")
                self.$dispatchEvent("debugger_command_0", {data: message.body});
        });
    };

    this.detach = function(tabId, callback) {
        this.$attached = false;
        callback();
    };

    this.debuggerCommand = function(tabId, v8Command) {
//        console.log("SEND:", v8Command);
        this.$socket.send(JSON.stringify({command: "debug", body: JSON.parse(v8Command)}));
    };

}).call(WebSocketV8DebuggerService.prototype);

return WebSocketV8DebuggerService;

});