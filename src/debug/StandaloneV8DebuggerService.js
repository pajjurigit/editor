var StandaloneV8DebuggerService = function(socket) {
    this.$socket = socket;
    this.$attached = false;
};

(function() {

    ace.implement(this, ace.MEventEmitter);

    this.attach = function(tabId, callback) {
        if (this.$attached)
            throw new Error("already attached!");

        var self = this;
        this.$reader = new MessageReader(this.$socket, function(messageText) {
//            console.log("Connect>", messageText);
            self.$reader = new MessageReader(self.$socket, ace.bind(self.$onMessage, self));
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
//        console.log("RECEVIE>", messageText);

        var response = new DevToolsMessage.fromString(messageText);
        var content = JSON.parse(response.getContent());

        this.$dispatchEvent("debugger_command_0", {data: content});
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