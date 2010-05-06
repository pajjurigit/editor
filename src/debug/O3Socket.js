var O3Socket = function(ip, port, o3) {
    this.$socket = o3.socketTCP();
    this.$ip = ip;
    this.$port = port;
};

(function() {

    this.state = "initialized";
    this.receivedText = "";

    // TODO use events
    this.onconnect = null;
    this.onreceive = null;

    this.close = function() {
        this.$socket.close();
    };

    this.clearBuffer = function() {
        this.$socket.clearBuf();
    };

    this.send = function(msg) {
        this.$socket.send(msg);
    };

    this.receive = function() {
        this.$socket.receive();
    };

    this.connect = function() {
        var socket = this.$socket;
        var self = this;
        socket.onconnect = function() {
            self.state = "connected";
            socket.receive();
            self.onconnect && self.onconnect();
            socket.onconnect = 0;
        };

        socket.onreceive = function() {
            self.receivedText = socket.receivedText;
            self.onreceive && self.onreceive();
        };
        this.$socket.connect(this.$ip, this.$port);
    };

}).call(O3Socket.prototype);