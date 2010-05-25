var WebSocketV8DebuggerService = function() {
    this.$socket = new io.Socket("localhost", {rememberTransport: false, port: 3000});
    this.$attached = false;
};

(function() {

    ace.implement(this, ace.MEventEmitter);

    this.attach = function(tabId, callback) {
        if (this.$attached)
            throw new Error("already attached!");

        var self = this;

        this.$socket.addEvent("connect", function() {
            callback();
        });

        this.$socket.addEvent("message", function(data) {
//            console.log("RECEIVE:", data);
            self.$dispatchEvent("debugger_command_0", {data: JSON.parse(data)});
        });

        this.$socket.connect();
    };

    this.detach = function(tabId, callback) {
        this.$socket.disconnect();
        this.$attached = false;
        callback();
    };

    this.debuggerCommand = function(tabId, v8Command) {
//        console.log("RECEIVE:", v8Command);
        this.$socket.send(v8Command);
    };

}).call(WebSocketV8DebuggerService.prototype);