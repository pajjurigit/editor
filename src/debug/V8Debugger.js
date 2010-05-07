var V8Debugger = function(tabId, v8service) {
    this.tabId = tabId;
    this.$service = v8service;

    var pending = this.$pending = [];

    var self = this;
    this.$service.addEventListener("debugger_command_" + tabId, function(e) {
        var response = V8Message.fromObject(e.data);
        var requestSeq = response.request_seq;
        if (pending[requestSeq]) {
            pending[requestSeq](response.body);
            delete pending[requestSeq];
        }

        if (response.event) {
            self.$dispatchEvent(response.event, {data: response.body});
        }
     });
};

(function() {

    ace.implement(this, ace.MEventEmitter);

    this.$seq = 0;

    this.continueScript = function(stepaction, stepcount, callback) {
        var msg = new V8Message("request");
        msg.command = "continue";
        if (stepaction) {
            msg.arguments = {
                stepcount: stepcount || 1,
                stepaction: stepaction
            };
        }
        this.$send(msg, callback);
    };

    this.lookup = function(handles, includeSource, callback) {
        var msg = new V8Message("request");
        msg.command = "lookup";
        msg.arguments = {
            inlineRefs: false,
            handles: handles
        };
        if (includeSource)
            msg.arguments.includesSource = includeSource;

        this.$send(msg, callback);
    };

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

    this.setbreakpoint = function(type, target, line, column, enabled, condition, ignoreCount, callback) {
        var msg = new V8Message("request");
        msg.command = "setbreakpoint";
        msg.arguments = {
            type: type,
            target: target,
            line: line,
            enabled: enabled === undefined ? enabled : true
        };

        if (column)
            msg.column = column;

        if (condition)
            msg.condition = condition;

        if (ignoreCount)
            msg.ignoreCount = ignoreCount;

        this.$send(msg, callback);
    };

    this.changebreakpoint = function(breakpoint, enabled, condition, ignoreCount, callback) {
        var msg = new V8Message("request");
        msg.command = "changebreakpoint";
        msg.arguments = {
            enabled: enabled !== true ? false : true,
            breakpoint: breakpoint
        };

        if (condition)
            msg.condition = condition;

        if (ignoreCount)
            msg.ignoreCount = ignoreCount;

        this.$send(msg, callback);
    };

    this.clearbreakpoint = function(breakpoint, callback) {
        var msg = new V8Message("request");
        msg.command = "clearbreakpoint";
        msg.arguments = {
            breakpoint: breakpoint
        };
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