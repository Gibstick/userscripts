// ==UserScript==
// @name        Ctrl+Enter in Stepper
// @namespace   gibstick
// @description Ctrl+enter to submit a step in the stepper, and various other shortcuts
// @include     https://www.student.cs.uwaterloo.ca/~cs135/stepping/index.php?*
// @version     1.0.1
// @grant       none
// ==/UserScript==

/**
 * Find the leftmost parenthesis for the current paren-block.
 * string: The string in which to search.
 * pos: The current cursor position; starting point of the search.
 */
function findLeftParen(string, pos) {
    var closeParens = 0;
    for (var i = pos; i >= 0; i--) {
        if (string[i] === ")") 
            closeParens++;
        if (string[i] === "(") {
            if (closeParens === 0) {
                return i;
            } else {
                closeParens--;
            }
        }
    }
    return -1;
}

/**
 * Find the rightmost parenthesis for the current paren-block.
 * string: The string in which to search.
 * pos: The current cursor position; starting point of the search.
 */
function findRightParen(string, pos, openParens, length) {
    length = length || string.length;
    openParens = openParens || 0; // set default accumulator
    var cur = string[pos];

    if (pos === (length)) {
        return -1;
    }

    if (cur === ")") {
        if (openParens === 0) {
            return pos;
        } else {
            return findRightParen(string, ++pos, --openParens);
        }
    }

    if (cur === "(") {
        return findRightParen(string, ++pos, ++openParens);
    }

    return findRightParen(string, ++pos, openParens);
}

/**
 * Function to be bound to a CodeMirror keyboard shortcut. Selects all the text within the current paren block.
 * cm: The CodeMirror editor instance. 
 */
function selectWithinParen(cm) {
    var curPos = cm.getCursor();
    var curLine = cm.getLine(curPos.line);

    // need a -1 so that we don't grab a right paren that is next to the cursor
    var left = findLeftParen(curLine, curPos.ch - 1);
    var right = findRightParen(curLine, curPos.ch);

    if (left < right) {
        var anchor = {line: curPos.line, ch: left};
        var head = {line: curPos.line, ch: right + 1}; // + 1 to actually select the right paren
        cm.setSelection(anchor, head);
    }
}

// Add keyboard shortcuts for buttons
codeMirrorInput.addKeyMap({
    // Submit step
    "Ctrl-Enter": (cm) => {
        getStep('step');
    },
    // Simplest form
    "Shift-Ctrl-Enter": (cm) => {
        getStep('value');
    },
    // Error
    "Shift-Ctrl-E" : (cm) => {
        getStep('err');
    },
    // Overwrite editor with previous step (start over)
    "Ctrl-Insert": (cm) => {
        var steps = document.getElementsByClassName("code");
        var insertedText = steps[steps.length - 1].textContent;
        cm.setValue(insertedText);
        indentAll();
    },
    // Tab-key functionality like Dr.Racket for auto-indent
    "Tab": "indentAuto",
    "Shift-Tab": "indentAuto",
    // Select all text within the current paren block
    "Ctrl-Q" : (cm) => {
        selectWithinParen(cm);
    }
});

// optional
codeMirrorInput.setOption(
    "lineNumbers", true
);
