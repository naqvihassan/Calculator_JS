const variables = {};
let lastResult = null;  // keep last calculated result
let history = [];
let historyIndex = -1;

const input = document.getElementById("input-value");
const output = document.getElementById("output");

const buttons = document.querySelectorAll("button[data-value]");
const evaluate = document.getElementById("evaluate");
const clear = document.getElementById("clear");
const backspace = document.getElementById("backspace");
const storeBtn = document.getElementById("store-btn");
const memoryBack = document.getElementById("memory-backward");
const memoryForward = document.getElementById("memory-forward");
const themeToggle = document.getElementById("theme-toggle");



// Theme toggle functionality
themeToggle.addEventListener("click", function() {
    document.body.classList.toggle("light-mode");
    
    // Update button icon
    if (document.body.classList.contains("light-mode")) {
        themeToggle.textContent = "🌙";
    } else {
        themeToggle.textContent = "☀️";
    }
});


// store history of expressions
function addToHistory(expr) {
    if (expr && (history.length === 0 || history[history.length - 1] !== expr)) {
        history.push(expr);
        console.log("Added to history: " + expr);
    }
    historyIndex = history.length - 1; // reset pointer to end
    console.log("HistoryIndex: ", historyIndex);
}

// put cursor at the end of input
function focusInputToEnd() {
    input.focus();
    let len = input.value.length;
    input.setSelectionRange(len, len);
}

// change variable names in expression with their values
function replaceVars(expr) {
    return expr.replace(/\b[a-zA-Z]+\b/g, function (name) {
        if (variables[name] !== undefined) {
            return variables[name];
        } else {
            return name;
        }
    });
}

// convert math terms to javascript
function convert(expr) {
    expr = expr.replace(/π/g, "Math.PI");
    expr = expr.replace(/\be\b/g, "Math.E");
    expr = expr.replace(/sqrt\(/g, "Math.sqrt(");
    expr = expr.replace(/sin\(([^)]+)\)/g, "Math.sin(($1) * Math.PI / 180)");
    expr = expr.replace(/cos\(([^)]+)\)/g, "Math.cos(($1) * Math.PI / 180)");
    expr = expr.replace(/tan\(([^)]+)\)/g, "Math.tan(($1) * Math.PI / 180)");
    expr = expr.replace(/\^/g, "**");
    return expr;
}

// check brackets
function bracketsCheck(expr) {
    let open = 0;
    let close = 0;
    for (let c of expr) {
        if (c === "(") open++;
        if (c === ")") close++;
    }
    return open === close;
}

// evaluate expressions normally
function evaluateExpression(expr) {
    try {
        expr = replaceVars(expr);

        if (expr.trim() === "") {
            return "Empty input";
        }

        if (!bracketsCheck(expr)) {
            return "Mismatched brackets";
        }

        if (/[\+\-\*\/\^]{2,}/.test(expr)) {
            return "Invalid operator sequence";
        }

        let jsExpr = convert(expr);
        let res = eval(jsExpr);

        if (isNaN(res)) {
            return "Not a number";
        }

        if (!isFinite(res)) {
            return "Infinity not allowed";
        }

        lastResult = res;
        return res;
    }
    catch (err) {
        lastResult = null;
        return "Syntax Error";
    }
}

// handle storing variables
function handleStoring(expr) {
    if (expr.includes("=>")) {
        let parts = expr.split("=>");
        let calc = parts[0].trim();
        let varName = parts[1].trim();

        if (varName === "" || !/^[a-zA-Z]+$/.test(varName)) {
            return "Invalid variable name";
        }

        let result = evaluateExpression(calc);

        if (typeof result === "number") {
            variables[varName] = result;
            console.log("Variable stored: " + varName + " = " + result);
            return "Stored: " + varName + " = " + result + " (value saved successfully)";
        }
        else {
            return "Error: " + result;
        }
    }
    else {
        let result = evaluateExpression(expr);
        return result;
    }
}

// button clicks add values to input
buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
        input.value += btn.dataset.value;
        focusInputToEnd();
    });
});

// backspace button removes last character
backspace.addEventListener("click", function () {
    input.value = input.value.slice(0, -1);
    focusInputToEnd();
});

// clear button clears everything
clear.addEventListener("click", function () {
    input.value = "";
    output.textContent = "Result: ";
});

// store button appends " => " so user can type var name
storeBtn.addEventListener("click", function () {
    if (lastResult === null) {
        output.textContent = "Error: calculate something first to store";
    } else {
        input.value += " => ";
        focusInputToEnd();
    }
});

// evaluate (=) button
evaluate.addEventListener("click", function () {
    let expr = input.value;
    let res = handleStoring(expr);
    console.log("Result: " + res);

    if (typeof res === "number") {
        output.textContent = "Result: " + res.toFixed(4);
        addToHistory(expr); // store expression in history
    } else if (res === "Empty input") {
        output.textContent = "Result: ";
    } else if (res.startsWith("Stored:")) {
        //Handle stored variables
        output.textContent = res;
        addToHistory(expr); // store expression in history
    } else {
        // Handle other error messages
        output.textContent = "Error: " + res;
    }
});

// backward history
memoryBack.addEventListener("click", function () {
    console.log("History: ", history);
    console.log("Current index: ", historyIndex);
    if (history.length === 0) return;
    if (historyIndex > 0) historyIndex--;
    input.value = history[historyIndex];
    focusInputToEnd();
});

// forward history
memoryForward.addEventListener("click", function () {
    if (history.length === 0) return;
    if (historyIndex < history.length - 1) {
        historyIndex++;
        input.value = history[historyIndex];
    } else {
        historyIndex = history.length;
        input.value = ""; // blank if moved past latest
    }
    focusInputToEnd();
});

// Clear all history and variable stored
document.getElementById("all-clear").addEventListener("click", function () {
    history = [];
    historyIndex = -1;
    input.value = "";
    output.textContent = "Result: ";

    for (let key in variables) {
        delete variables[key];
    }
    console.log("All history and variables cleared");
});

// keyboard handling
input.addEventListener("keydown", function (e) {
    const allowed = [
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
        "+", "-", "*", "/", "(", ")", ".", "^", "x","y", "z",
        "Backspace", "Delete", "ArrowLeft", "ArrowRight", "Enter", "Tab"
    ];

    if (!allowed.includes(e.key)) {
        e.preventDefault();
    }

    if (e.key === "Enter") {
        e.preventDefault();
        evaluate.click();
    }
});

// tab key just focuses input and moves cursor to end
document.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
        e.preventDefault();
        focusInputToEnd();
    }
});