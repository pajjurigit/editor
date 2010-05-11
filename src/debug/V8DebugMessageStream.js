var V8DebugMessageStream = function(socket) {
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

        var self = this;
        this.$socket.onreceive = function() {
            self.$onreceive();
        };

        this.$dispatchEvent("connect");
    };

    this.$onreceive = function() {
        var lastChunk = this.$socket.receivedText;
        this.$socket.clearBuffer();
        this.$received += lastChunk;

        // if there are whole messages on the pipe let's dispatch them
        while (fullResponse = this.$checkForWholeMessage()) {
//            console.log("> Received from Chrome:\n", fullResponse);
            this.$dispatchResponse(new DevToolsMessage.fromString(fullResponse));
        }
    };

    this.$checkForWholeMessage = function() {
        var i, c, l;
        var responseLength;
        var fullResponse = false;
        var received = this.$received;

        if ((i = received.indexOf('\r\n\r\n')) != -1) {
            if ((c = received.indexOf('Content-Length:')) != -1) {
                l = received.substring(c + 15);
                l = l.substring(0, l.indexOf('\r\n'));
                responseLength = i + 4 + parseInt(l, 10);
                if (responseLength <= received.length) {
                    fullResponse = received.substring(0, responseLength);
                    this.$received = received.substring(responseLength);
                }
            }
        }
        return fullResponse;
    };

    this.$dispatchResponse = function(response) {
        var self = this;
        setTimeout(function() {
            self.$dispatchEvent("message", {data: response});
        }, 0);
    };

    this.$onerror = function() {
        this.$dispatchEvent("error");
    };

    this.MSG_HANDSHAKE = "ChromeDevToolsHandshake\r\n";

}).call(V8DebugMessageStream.prototype);