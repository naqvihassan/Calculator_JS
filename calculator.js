function addToHistory(expr) {
    if (expr && (history.length === 0 || history[history.length - 1] !== expr)) {
        history.push(expr);
    }
    historyIndex = history.length - 1;
}

function replaceVars(expr) {
    return expr.replace(/\b[a-zA-Z]+\b/g, function (name) {
        if (variables[name] !== undefined) {
            return variables[name];
        } else {
            return name;
        }
    });
}

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

function bracketsCheck(expr) {
    let open = 0;
    let close = 0;
    for (let c of expr) {
        if (c === "(") open++;
        if (c === ")") close++;
    }
    return open === close;
}

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