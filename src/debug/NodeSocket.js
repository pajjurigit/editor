/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */

if (!require.def) require.def = require("requireJS-node")(module);

require.def("debug/NodeSocket", ["net"], function(net) {

var NodeSocket = function(ip, port) {
    this.$stream = new net.Stream();
    this.$stream.setEncoding('utf8');

    var _self = this;
    this.$stream.addListener('data', function(data) {
        _self.$onData(data);
    });

    this.$stream.addListener('end', function () {
        _self.$stream.end();
        _self.onend && _self.onend();
    });

    this.$stream.addListener('connect', function () {
        _self.onconnect && _self.onconnect();
    });

    this.$ip = ip;
    this.$port = port;
};

(function() {

    this.receivedText = "";

    // TODO use events
    this.onconnect = null;
    this.onreceive = null;
    this.onend = null;

    this.close = function() {
        this.$stream.end();
    };

    this.clearBuffer = function() {
    };

    this.send = function(msg) {
        // console.log("> sent to socket:\n", msg)
        this.$stream.write(msg, 'utf8');
    };

    this.setMinReceiveSize = function(minSize) {};

    this.$onData = function(data) {
        this.receivedText = data;
        // console.log("> received from socket:\n", this.receivedText, this.receivedText.length)
        this.onreceive && this.onreceive();
    };

    this.connect = function() {
        this.$stream.connect(this.$port, this.$ip);
    };

}).call(NodeSocket.prototype);

return NodeSocket;

});