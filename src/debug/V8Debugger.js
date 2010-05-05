var V8Debugger = function(tabId, v8service) {
    this.tabId = tabId;
    this.$service = v8service;

    var pending = this.$pending = [];

    this.$service.addEventListener("debugger_command_" + tabId, function(e) {
        var response = V8Message.fromObject(e.data);
        var requestSeq = response.request_seq;
        if (pending[requestSeq]) {
            pending[requestSeq](response.body);
            delete pending[requestSeq];
        }
    });
};

(function() {

    this.$seq = 0;

    this.version = function(callback) {
        var msg = new V8Message("request");
        msg.command = "version";
        this.$send(msg, callback);
    };

    this.scripts = function(types, ids, includeSource, callback) {
        var msg = new V8Message("request");
        msg.command = "scripts";
        msg.arguments = {
            types: types || V8Debugger.NORMAL_SCRIPTS,
            includeSource: !!includeSource
        };
        if (ids) {
            msg.arguments.ids = ids;
        }
        this.$send(msg, callback);
    };

    this.$send = function(msg, callback) {
        this.$pending[msg.seq] = callback;
        this.$service.debuggerCommand(this.tabId, msg.stringify());
    };

}).call(V8Debugger.prototype);

V8Debugger.NATIVE_SCRIPTS = 1;
V8Debugger.EXTENSION_SCRIPTS = 2;
V8Debugger.NORMAL_SCRIPTS = 4;