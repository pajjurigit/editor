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

    "test: continue": function() {
        var called = false;

        V8Message.$seq = 245;

        this.$debugger.continueScript(null, null, function() {
            called = true;
        });

        var request = {
            "command":"debugger_command",
            "data":{
                "seq":245,
                "type":"request",
                "command":"continue"
            }
        };
        assertJsonEquals(request, JSON.parse(this.$msgStream.requests[0].getContent()));

        var response = {
            "command":"debugger_command",
            "result":0,
            "data":{
                "seq":77,
                "request_seq":245,
                "type":"response",
                "command":"continue",
                "success":true,
                "running":true
            }
        };
        this.sendMessage(JSON.stringify(response));
        assertTrue(called);
    },

    "test: step into": function() {
        var called = false;

        V8Message.$seq = 254;

        this.$debugger.continueScript("in", 1, function() {
            called = true;
        });

        var request = {
            "command":"debugger_command",
            "data":{
                "seq":254,
                "type":"request",
                "command":"continue",
                "arguments":{
                    "stepcount":1,
                    "stepaction":"in"
                }
            }
        };

        assertJsonEquals(request, JSON.parse(this.$msgStream.requests[0].getContent()));

        var response = {
            "command":"debugger_command",
            "result":0,
            "data":{
                "seq":10,
                "request_seq":254,
                "type":"response",
                "command":"continue",
                "success":true,
                "running":true
            }
        };
        this.sendMessage(JSON.stringify(response));
        assertTrue(called);
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
    },

    "test: setBreakpoint": function() {
        var called = false;

        V8Message.$seq = 50;

        this.$debugger.setbreakpoint("script", "http://abc.nl/juhu.js", 24, 0, true, null, 0, function(body) {
            assertEquals("scriptName", body.type);
            assertEquals(1, body.breakpoint);
            assertEquals(24, body.line);
            called = true;
        });

        var request = {
            "command":"debugger_command",
            "data":{
                "seq":50,
                "type":"request",
                "command":"setbreakpoint",
                "arguments":{
                    "type":"script",
                    "target":"http://abc.nl/juhu.js",
                    "line":24,
                    "enabled":true
                }
            }
        };
        assertJsonEquals(request, JSON.parse(this.$msgStream.requests[0].getContent()));

        var response = {
            "command":"debugger_command",
            "result":0,
            "data":{
                "seq":70,
                "request_seq":50,
                "type":"response",
                "command":"setbreakpoint",
                "success":true,
                "body":{
                    "type":"scriptName",
                    "breakpoint":1,
                    "script_name":"http://abc.nl/juhu.js",
                    "line":24,
                    "column":null
                },
                "refs":[],
                "running":true
            }
        };
        this.sendMessage(JSON.stringify(response));
        assertTrue(called);
    },

    "test: change breakpoint": function() {
        var called = false;

        V8Message.$seq = 225;

        this.$debugger.changebreakpoint(2, false, null, 0, function(body) {
            called = true;
        });

        var request = {
            "command":"debugger_command",
            "data":{
                "seq":225,
                "type":"request",
                "command":"changebreakpoint",
                "arguments":{
                    "enabled":false,
                    "breakpoint":2
                }
            }
        };
        assertJsonEquals(request, JSON.parse(this.$msgStream.requests[0].getContent()));

        var response = {
            "command":"debugger_command",
            "result":0,
            "data":{
                "seq":58,
                "request_seq":225,
                "type":"response",
                "command":"changebreakpoint",
                "success":true,
                "running":true
            }
        };
        this.sendMessage(JSON.stringify(response));
        assertTrue(called);
    },

    "test: clear breakpoint": function() {
        var called = false;

        V8Message.$seq = 228;

        this.$debugger.clearbreakpoint(1, function(body) {
            called = true;
        });

        var request = {
            "command":"debugger_command",
            "data":{
                "seq":228,
                "type":"request",
                "command":"clearbreakpoint",
                "arguments":{
                    "breakpoint":1
                }
            }
        };
        assertJsonEquals(request, JSON.parse(this.$msgStream.requests[0].getContent()));

        var response = {
            "command":"debugger_command",
            "result":0,
            "data":{
                "seq":64,
                "request_seq":228,
                "type":"response",
                "command":"clearbreakpoint",
                "success":true,
                "body":{
                    "breakpoint":1
                },
                "refs":[],
                "running":true
            }
        };
        this.sendMessage(JSON.stringify(response));
        assertTrue(called);
    },

    "test: break event": function() {
        var called = false;

        this.$debugger.addEventListener("break", function(e) {
            called = true;
            assertEquals(1, e.data.breakpoints[0]);
        });

        var response = {
            "command":"debugger_command",
            "result":0,
            "data":{
                "seq":20,
                "type":"event",
                "event":"break",
                "body":{
                    "invocationText":"#<an HTMLTextAreaElement>.logKey(e=#<a KeyboardEvent>)",
                    "sourceLine":69,
                    "sourceColumn":4,
                    "sourceLineText":"    console.log(e.type, e.charCode, e.keyCode, e);",
                    "script":{
                        "id":35,
                        "name":"file:///Users/fabianpb/Desktop/EclipseWorkspaces/ajax.org/editor/experiments/key_event_logger.html",
                        "lineOffset":38,
                        "columnOffset":0,
                        "lineCount":58
                    },
                    "breakpoints":[1]
                }
            }
        };
        this.sendMessage(JSON.stringify(response));
        assertTrue(called);
    },

    "test: test exception event": function() {
        var called = false;

        this.$debugger.addEventListener("exception", function(e) {
            called = true;
        });

        var response = {
            "command":"debugger_command",
            "result":0,
            "data":{
                "seq":63,
                "type":"event",
                "event":"exception",
                "success":true,
                "body":{
                    "uncaught":true,
                    "exception":{
                        "handle":0,
                        "type":"error",
                        "className":"Error",
                        "constructorFunction":{"ref":4},
                        "protoObject":{"ref":5},
                        "prototypeObject":{"ref":6},
                        "properties":[
                            {"name":"stack","propertyType":3,"ref":6},
                            {"name":"message","ref":7}
                        ],
                        "text":"Error: Buhhh"
                    },
                    "sourceLine":69,
                    "sourceColumn":10,
                    "sourceLineText":"    throw new Error(\"Buhhh\");",
                    "script":{
                        "id":50,
                        "name":"http://juhu.nl/key_event_logger.html",
                        "lineOffset":38,
                        "columnOffset":0,
                        "lineCount":59
                    }
                },
                "refs":[{
                    "handle":4,
                    "type":"function",
                    "className":"Function",
                    "constructorFunction":{"ref":8},
                    "protoObject":{"ref":9},
                    "prototypeObject":{"ref":5},
                    "name":"Error",
                    "inferredName":"",
                    "resolved":true,
                    "source":"function Error() { [native code] }",
                    "properties":[{
                        "name":"stackTraceLimit",
                        "propertyType":1,
                        "ref":10
                    },{
                        "name":"arguments",
                        "attributes":7,
                        "propertyType":3,
                        "ref":11
                    },{
                        "name":"length",
                        "attributes":7,
                        "propertyType":3,
                        "ref":12
                    },{
                        "name":"captureStackTrace",
                        "propertyType":2,
                        "ref":13
                    },{
                        "name":"name",
                        "attributes":7,
                        "propertyType":3,
                        "ref":14
                    },{
                        "name":"prototype",
                        "attributes":7,
                        "propertyType":3,
                        "ref":5
                    },{
                        "name":"caller",
                        "attributes":7,
                        "propertyType":3,
                        "ref":11
                    }],
                    "text":"function Error() { [native code] }"
                },{
                    "handle":5,
                    "type":"error",
                    "className":"Error",
                    "constructorFunction":{"ref":4},
                    "protoObject":{"ref":15},
                    "prototypeObject":{"ref":6},
                    "properties":[{
                        "name":"message",
                        "propertyType":1,
                        "ref":16
                    },{
                        "name":"toString",
                        "attributes":2,
                        "propertyType":1,
                        "ref":17
                    },{
                        "name":"name",
                        "propertyType":1,
                        "ref":14
                    },{
                        "name":"constructor",
                        "attributes":2,
                        "propertyType":1,
                        "ref":4
                    }],
                    "text":"Error"
                },{
                    "handle":6,
                    "type":"undefined",
                    "text":"undefined"
                },{
                    "handle":7,
                    "type":"string",
                    "value":"Buhhh",
                    "length":5,
                    "text":"Buhhh"
                }]
            }
        };
        this.sendMessage(JSON.stringify(response));
        assertTrue(called);
    }
});