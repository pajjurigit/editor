/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */
require.def("ace/conf/keybindings/default_win", function() {

return {
    "selectall": "Control-A",
    "removeline": "Control-D",
    "gotoline": "Control-L",
    "togglecomment": "Control-7",
    "findnext": "Control-K",
    "findprevious": "Control-Shift-K",
    "find": "Control-F",
    "undo": "Control-Z",
    "redo": "Control-Shift-Z|Control-Y",
    "overwrite": "Insert",
    "copylinesup": "Control-Alt-Up",
    "movelinesup": "Alt-Up",
    "selecttostart": "Control-Shift-Up",
    "gotostart": "Control-Home|Control-Up",
    "selectup": "Shift-Up",
    "golineup": "Up",
    "copylinesdown": "Control-Alt-Down",
    "movelinsedown": "Alt-Down",
    "selecttoend": "Control-Shift-Down",
    "gotoend": "Control-End|Control-Down",
    "selectdown": "Shift-Down",
    "godown": "Down",
    "selectwordleft": "Alt-Shift-Left",
    "gotowordleft": "Alt-Left",
    "selecttolinestart": "Control-Shift-Left",
    "gotolinestart": "Control-Left|Home",
    "selectleft": "Shift-Left",
    "gotoleft": "Left",
    "selectwordright": "Alt-Shift-Right",
    "gotowordright": "Alt-Right",
    "selecttolineend": "Control-Shift-Right",
    "gotolineend": "Control-Right|End",
    "selectright": "Shift-Right",
    "gotoright": "Right",
    "selectpagedown": "Shift-PageDown",
    "pagedown": "PageDown",
    "selectpageup": "Shift-PageUp",
    "pageup": "PageUp",
    "selectlinestart": "Shift-Home",
    "selectlineend": "Shift-End",
    "del": "Delete",
    "backspace": "Backspace",
    "outdent": "Shift-Tab",
    "indent": "Tab"
};

});
