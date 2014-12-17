// ==UserScript==
// @name        Ctrl+Enter in Stepper
// @namespace   gibstick
// @description Ctrl+enter to submit a step in the stepper, and various other shortcuts
// @include     https://www.student.cs.uwaterloo.ca/~cs135/stepping/index.php?*
// @version     1.0
// @grant       none
// ==/UserScript==

// codeMirrorInput.getValue();
// codeMirrorInput.setValue("");

console.debug("343");

function findLeftParen(string, pos) {
    for (var i = pos; i >= 0; i--) {
        if (string[i] === "(")
            return i;
    }
    return -1;
}

function findRightParen(string, pos, openParens, length) {
    length = length || string.length;
    openParens = openParens || 0; // set default accumulator
    var cur = string[pos];

    if (pos === (length)) {
        return -1;
    }

    //console.debug(cur + ", " + openParens);

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

function selectWithinParen(cm) {
    var curPos = cm.getCursor();
    var curLine = cm.getLine(curPos.line);

    var left = findLeftParen(curLine, curPos.ch);

    var right = -1;

    var right = findRightParen(curLine, curPos.ch) + 1;


    if (left < right) {
        var anchor = {line: curPos.line, ch: left};
        var head = {line: curPos.line, ch: right};
        cm.setSelection(anchor, head);
    }
}

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
    // Tab-key functionality like Dr.Racket
    "Tab": "indentAuto",
    "Shift-Tab": "indentAuto",
    // Auto-select within parentheses
    "Ctrl-Q" : (cm) => {
        selectWithinParen(cm);
    }
});

codeMirrorInput.setOption(
    "lineNumbers", true
);
