var ChromeDebugMessageStream = function(socket) {
    this.$socket = socket;
};

(function() {

    ace.implement(this, ace.MEventEmitter);

    this.$received = "";

    this.connect = function() {
        var socket = this.$socket;
        var self = this;
        socket.onconnect = function() {
            self.$onconnect();
        };
        socket.onreceive = function() {
            self.$onhandshake();
        };
        socket.connect();
    };

    this.sendRequest = function(message) {
//        console.log("> Sent to Chrome:\n", message.stringify());
        this.$socket.send(message.stringify());
    };

    this.$onconnect = function() {
        this.$socket.send(this.MSG_HANDSHAKE);
    };

    this.$onhandshake = function() {
        var lastChunk = this.$socket.receivedText;
        this.$socket.clearBuffer();

        if (lastChunk !== this.MSG_HANDSHAKE) {
            this.$socket.onreceive = null;
            return this.$onerror();
        }

        this.$socket.onreceive = null;
        this.$reader = new MessageReader(this.$socket, ace.bind(this.$onMessage, this));

        this.$dispatchEvent("connect");
    };

    this.$onMessage = function(messageText) {
        var self = this;
        setTimeout(function() {
            var response = new DevToolsMessage.fromString(messageText);
            self.$dispatchEvent("message", {data: response});
        }, 0);
    };

    this.$onerror = function() {
        this.$dispatchEvent("error");
    };

    this.MSG_HANDSHAKE = "ChromeDevToolsHandshake\r\n";

}).call(ChromeDebugMessageStream.prototype);