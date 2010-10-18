/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */

require.def([
     "ace/lib/oop",
     "ace/MEventEmitter"
 ], function(
     oop,
     MEventEmitter
 ) {

var EventEmitter = function() {};

oop.implement(EventEmitter.prototype, MEventEmitter);

var EventEmitterTest = new TestCase("EventEmitterTest", {
    "test: dispatch event with no data" : function() {
        var emitter = new EventEmitter();

        var called = false;
        emitter.addEventListener("juhu", function(e) {
           called = true;
           assertEquals("juhu", e.type);
        });

        emitter.$dispatchEvent("juhu");
        assertTrue(called);
    }
});

});