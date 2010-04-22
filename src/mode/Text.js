ace.provide("ace.mode.Text");

ace.mode.Text = function() {
    var rules = {
        "start" : [ {
            token : "text",
            regex : ".+"
        } ]
    };
    this.$tokenizer = new ace.Tokenizer(rules);
};

(function() {

    this.getTokenizer = function() {
        return this.$tokenizer;
    };

    this.toggleCommentLines = function(doc, range, state) {
        return 0;
    };

    this.getNextLineIndent = function(line, state, tab) {
        return "";
    };

    this.$getIndent = function(line) {
        var match = line.match(/^(\s+)/);
        if (match) {
            return match[1];
        }

        return "";
    };

}).call(ace.mode.Text.prototype);