var JavaScriptTest = new TestCase("mode.JavaScriptTest", {

    setUp : function() {
        this.mode = new ace.mode.JavaScript();
    },

    "test: getTokenizer() (smoke test)" : function() {
        var tokenizer = this.mode.getTokenizer();

        assertTrue(tokenizer instanceof ace.Tokenizer);

        var tokens = tokenizer.getLineTokens("'juhu'", "start").tokens;
        assertEquals("string", tokens[0].type);
    },

    "test: toggle comment lines should prepend '//' to each line" : function() {
        var doc = new ace.Document(["  abc", "cde", "fg"]);

        var range = new ace.Range(0, 3, 1, 1);
        var comment = this.mode.toggleCommentLines("start", doc, range);
        assertEquals(["//  abc", "//cde", "fg"].join("\n"), doc.toString());
    },

    "test: toggle comment on commented lines should remove leading '//' chars" : function() {
        var doc = new ace.Document(["//  abc", "//cde", "fg"]);

        var range = new ace.Range(0, 3, 1, 1);
        var comment = this.mode.toggleCommentLines("start", doc, range);
        assertEquals(["  abc", "cde", "fg"].join("\n"), doc.toString());
    },

    "test: toggle comment on multiple lines with one commented line prepend '//' to each line" : function() {
        var doc = new ace.Document(["//  abc", "//cde", "fg"]);

        var range = new ace.Range(0, 3, 2, 1);
        var comment = this.mode.toggleCommentLines("start", doc, range);
        assertEquals(["////  abc", "////cde", "//fg"].join("\n"), doc.toString());
    },

    "test: auto indent after opening brace" : function() {
        assertEquals("  ", this.mode.getNextLineIndent("start", "if () {", "  "));
    },

    "test: no auto indent after opening brace in multi line comment" : function() {
        assertEquals("", this.mode.getNextLineIndent("start", "/*if () {", "  "));
        assertEquals("  ", this.mode.getNextLineIndent("comment", "  abcd", "  "));
    },

    "test: no auto indent after opening brace in single line comment" : function() {
        assertEquals("", this.mode.getNextLineIndent("start", "//if () {", "  "));
        assertEquals("  ", this.mode.getNextLineIndent("start", "  //if () {", "  "));
    },

    "test: no auto indent should add to existing indent" : function() {
        assertEquals("      ", this.mode.getNextLineIndent("start", "    if () {", "  "));
        assertEquals("    ", this.mode.getNextLineIndent("start", "    cde", "  "));
    },

    "test: special indent in doc comments" : function() {
        assertEquals(" * ", this.mode.getNextLineIndent("doc-start", "/**", " "));
        assertEquals("   * ", this.mode.getNextLineIndent("doc-start", "  /**", " "));
        assertEquals(" * ", this.mode.getNextLineIndent("doc-start", " *", " "));
        assertEquals("    * ", this.mode.getNextLineIndent("doc-start", "    *", " "));
        assertEquals("  ", this.mode.getNextLineIndent("doc-start", "  abc", " "));
    },

    "test: no indent after doc comments" : function() {
        assertEquals("", this.mode.getNextLineIndent("doc-start", "   */", "  "));
    },

    "test: trigger outdent if line is space and new text starts with closing brace" : function() {
        assertTrue(this.mode.checkOutdent("start", "   ", " }"));
        assertFalse(this.mode.checkOutdent("start", " a  ", " }"));
        assertFalse(this.mode.checkOutdent("start", "", "}"));
        assertFalse(this.mode.checkOutdent("start", "   ", "a }"));
        assertFalse(this.mode.checkOutdent("start", "   }", "}"));
    },

    "test: auto outdent should indent the line with the same indent as the line with the matching opening brace" : function() {
        var doc = new ace.Document(["  function foo() {", "    bla", "    }"]);
        this.mode.autoOutdent("start", doc, 2);
        assertEquals("  }", doc.getLine(2));
    },

    "test: no auto outdent if no matching brace is found" : function() {
        var doc = new ace.Document(["  function foo()", "    bla", "    }"]);
        this.mode.autoOutdent("start", doc, 2);
        assertEquals("    }", doc.getLine(2));
    }

});