/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */
require.def("debug/StandaloneV8DebuggerService", 
    ["ace/lib/oop", "ace/lib/lang", "ace/MEventEmitter"], 
    function(ace, lang, MEventEmitter) {

if (!require.def) require.def = require("requireJS-node")(module);
    
var StandaloneV8DebuggerService = function(socket) {
    this.$socket = socket;
    this.$attached = false;
};

(function() {

    oop.implement(this, MEventEmitter);

    this.attach = function(tabId, callback) {
        if (this.$attached)
            throw new Error("already attached!");

        var self = this;
        this.$reader = new MessageReader(this.$socket, function(messageText) {
//            console.log("Connect>", messageText);
            self.$reader = new MessageReader(self.$socket, lang.bind(self.$onMessage, self));
            callback();
        });
        this.$socket.connect();
    };

    this.detach = function(tabId, callback) {
        this.$socket.close();
        this.$attached = false;
        callback();
    };

    this.$onMessage = function(messageText) {

        var self = this;
        setTimeout(function() {
            var response = new DevToolsMessage.fromString(messageText);

            var contentText = response.getContent();
            if (!contentText)
                return;

            var content = JSON.parse(contentText);
            self.$dispatchEvent("debugger_command_0", {data: content});
        }, 0);
    };

    this.debuggerCommand = function(tabId, v8Command) {
        this.$send(v8Command);
    };

    this.$send = function(text) {
        var msg = ["Content-Length:", text.length, "\r\n\r\n", text].join("");
//        console.log("SEND>", msg);
        this.$socket.send(msg);
    };

}).call(StandaloneV8DebuggerService.prototype);

return StandaloneV8DebuggerService;

});