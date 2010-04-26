require.def("ace/mode/Css",
    [
        "ace/ace",
        "ace/mode/Text",
        "ace/Tokenizer",
        "ace/mode/CssHighlightRules",
        "ace/mode/MatchingBraceOutdent"
    ], function(ace, TextMode, Tokenizer, CssHighlightRules, MatchingBraceOutdent) {

var Css = function() {
    this.$tokenizer = new Tokenizer(new CssHighlightRules().getRules());
    this.$outdent = new MatchingBraceOutdent();
};
ace.inherits(Css, TextMode);

(function() {

    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);

        // ignore braces in comments
        var tokens = this.$tokenizer.getLineTokens(line, state).tokens;
        if (tokens.length && tokens[tokens.length-1].type == "comment") {
            return indent;
        }

        var match = line.match(/^.*\{\s*$/);
        if (match) {
            indent += tab;
        }

        return indent;
    };

    this.checkOutdent = function(state, line, input) {
        return this.$outdent.checkOutdent(line, input);
    };

    this.autoOutdent = function(state, doc, row) {
        return this.$outdent.autoOutdent(doc, row);
    };

}).call(Css.prototype);

return Css;
});