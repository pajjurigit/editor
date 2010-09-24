/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */

if (!require.def) require.def = require("requireJS-node")(module);

require.def("debug/DevToolsService", function() {

var DevToolsService = function(msgStream) {
    this.$msgStream = msgStream;
    this.$pending = [];

    var self = this;
    this.$msgStream.addEventListener("message", function(e) {
        var response = e.data;
        if (response.getHeaders()["Tool"] !== "DevToolsService") {
            return;
        }
        if (self.$pending.length) {
            self.$pending.shift()(JSON.parse(response.getContent()).data);
        }
    });
};

(function() {

    this.ping = function(callback) {
        this.$send("ping", callback);
    };

    this.getVersion = function(callback) {
        this.$send("version", callback);
    };

    this.listTabs = function(callback) {
        this.$send("list_tabs", callback);
    };

    this.$send = function(command, callback) {
        var msg = new DevToolsMessage(null, '{"command":"' + command + '"}');
        this.$msgStream.sendRequest(msg);
        this.$pending.push(callback);
    };

}).call(DevToolsService.prototype);

return DevToolsService;

});