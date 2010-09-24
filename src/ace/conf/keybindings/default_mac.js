/**
 * Ajax.org Code Editor (ACE)
 *
 * @copyright 2010, Ajax.org Services B.V.
 * @license LGPLv3 <http://www.gnu.org/licenses/lgpl-3.0.txt>
 * @author Fabian Jakobs <fabian AT ajax DOT org>
 */
require.def("ace/conf/keybindings/default_mac", function() {

return {
    "selectall": "Command-A",
    "removeline": "Command-D",
    "gotoline": "Command-L",
    "togglecomment": "Command-7",
    "findnext": "Command-K",
    "findprevious": "Command-Shift-K",
    "find": "Command-F",
    "replace": "Command-R",
    "undo": "Command-Z",
    "redo": "Command-Shift-Z|Command-Y",
    "overwrite": "Insert",
    "copylinesup": "Command-Option-Up",
    "movelinesup": "Option-Up",
    "selecttostart": "Command-Shift-Up",
    "gotostart": "Command-Home|Command-Up",
    "selectup": "Shift-Up",
    "golineup": "Up",
    "copylinesdown": "Command-Option-Down",
    "movelinsedown": "Option-Down",
    "selecttoend": "Command-Shift-Down",
    "gotoend": "Command-End|Command-Down",
    "selectdown": "Shift-Down",
    "godown": "Down",
    "selectwordleft": "Option-Shift-Left",
    "gotowordleft": "Option-Left",
    "selecttolinestart": "Command-Shift-Left",
    "gotolinestart": "Command-Left|Home",
    "selectleft": "Shift-Left",
    "gotoleft": "Left",
    "selectwordright": "Option-Shift-Right",
    "gotowordright": "Option-Right",
    "selecttolineend": "Command-Shift-Right",
    "gotolineend": "Command-Right|End",
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