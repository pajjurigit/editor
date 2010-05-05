var V8DebuggerTest = new TestCase("V8DebuggerTest", {

    setUp: function() {
        this.$msgStream = new MsgStreamMock();
        this.$service = new V8DebuggerService(this.$msgStream);
        this.$debugger = new V8Debugger(2, this.$service);
    },

    sendMessage: function(content) {
        var headers = {
            Tool: "V8Debugger",
            Destination: 2
        };
        this.$msgStream.$send(headers, content);
    },

    "test: version": function() {
        var called = false;

        V8Message.$seq = 11;

        this.$debugger.version(function(version) {
            called = true;
            assertEquals("2.1.10.5", version.V8Version);
        });

        this.sendMessage('{"command":"debugger_command","result":0,"data":{"seq":17,"request_seq":11,"type":"response","command":"version","success":true,"body":{"V8Version":"2.1.10.5"},"refs":[],"running":true}}');

        assertTrue(called);
    },

    "test: scripts": function() {
        var called = false;

        V8Message.$seq = 14;

        this.$debugger.scripts(V8Debugger.NORMAL_SCRIPTS, null, true, function(scripts) {
            assertEquals(4, scripts.length);
            called = true;
        });

        var response = {
            "command":"debugger_command",
            "result":0,
            "data":{
                "seq":88,
                "request_seq":14,
                "type":"response",
                "command":"scripts",
                "success":true,
                "body":[{
                    "handle":3,
                    "type":"script",
                    "name":"chrome-extension://ognampngfcbddbfemdapefohjiobgbdl/data_loader.js",
                    "id":25,
                    "lineOffset":0,
                    "columnOffset":0,
                    "lineCount":68,
                    "source":"function isRecordDump() {});",
                    "sourceLength":36039,
                    "scriptType":2,
                    "compilationType":0,
                    "context":{"ref":6},
                    "text":"undefined (lines: 972)"
                },{
                    "handle":8,
                    "type":"context",
                    "data":"page,1",
                    "text":"#<a ContextMirror>"
                },{
                    "handle":10,
                    "type":"context",
                    "text":"#<a ContextMirror>"
                },{
                    "handle":12,
                    "type":"context",
                    "data":"page,1",
                    "text":"#<a ContextMirror>"
                }],
                "running":true
            },
            "Tool":"V8Debugger",
            "Content-Length":450
        };

        this.sendMessage(JSON.stringify(response));
        assertTrue(called);
    }
});