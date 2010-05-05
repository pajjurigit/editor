var V8DebuggerService = function(msgStream) {
    this.$msgStream = msgStream;
    this.$pending = {};

    var self = this;
    this.$msgStream.addEventListener("message", function(e) {
        var response = e.data;
        if (response.getHeaders()["Tool"] !== "V8Debugger") {
            return;
        }

        var content = JSON.parse(response.getContent());
        var command = content.command;

        var queue = self.$pending[command];
        if (queue && queue.length) {
            queue.shift()(content.data);
        }

        var event = command;
        var tabId = response.getHeaders()["Destination"];
        if (tabId) {
            event += "_" + tabId;
        }

        self.$dispatchEvent(event, {data: content.data});
    });
};

(function() {

    ace.implement(this, ace.MEventEmitter);

    this.attach = function(tabId, callback) {
        this.$send(tabId, "attach", null, callback);
    };

    this.detach = function(tabId, callback) {
        this.$send(tabId, "detach", null, callback);
    };

    this.evaluateJavaScript = function(tabId, jsCode) {
        this.$send(tabId, "evaluate_javascript", '"' + jsCode + '"', null);
    };

    this.debuggerCommand = function(tabId, v8Command, callback) {
        this.$send(tabId, "debugger_command", v8Command, callback);
        this.$send(tabId, "evaluate_javascript", "javascript:void(0);", null);
    };

    this.$send = function(destination, command, data, callback) {
        var headers = {
            "Tool": "V8Debugger",
            "Destination": destination
        };

        var commandJson = ['{"command":"', command, '"'];
        data && commandJson.push(',"data":', data);
        commandJson.push('}');

        var msg = new DevToolsMessage(headers, commandJson.join(""));
        this.$msgStream.sendRequest(msg);

        if (callback) {
            if (!this.$pending[command])
                this.$pending[command] = [];

            this.$pending[command].push(callback);
        }
    };


}).call(V8DebuggerService.prototype);