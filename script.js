const input = document.getElementById("input-value");
const output = document.getElementById("output");

const buttons = document.querySelectorAll("button[data-value]");
const evaluate = document.getElementById("evaluate");
const clear = document.getElementById("clear");

// Allow only specific keys from keyboard
input.addEventListener("keydown", function (e) {
  const allowedKeys = [
    "0","1","2","3","4","5","6","7","8","9",
    "+","-","*","/","(",")",".","^",
    "Backspace","Delete","ArrowLeft","ArrowRight","Enter","Tab"
  ];    

  if (!allowedKeys.includes(e.key)) {
    e.preventDefault();
  }

  if (e.key === "Enter") {
    e.preventDefault();
    evaluate.click();
  }
});

// Replace simple scientific values with JS equivalents
function convert(expression) {
  // Replace common constants
  expression = expression.replace(/π/g, "Math.PI");
  expression = expression.replace(/\be\b/g, "Math.E");

  // Replace square root
  expression = expression.replace(/sqrt\(/g, "Math.sqrt(");

  // Replace trigonometric functions in degrees
  expression = expression.replace(/sin\(([^)]+)\)/g, "Math.sin(($1) * Math.PI / 180)");
  expression = expression.replace(/cos\(([^)]+)\)/g, "Math.cos(($1) * Math.PI / 180)");
  expression = expression.replace(/tan\(([^)]+)\)/g, "Math.tan(($1) * Math.PI / 180)");

  // Replace power symbol
  expression = expression.replace(/\^/g, "**");

  return expression;
}

// Evaluate the expression safely
function evaluateExpression(expression) {
  try {
    console.log("Original expression:", expression);
    if (!expression.trim()) {
      return "Empty input";
    }

    // Bracket mismatch check
    let open = 0, close = 0;
    for (let char of expression) {
      if (char === "(") open++;
      if (char === ")") close++;
    }
    if (open !== close) {
      return "Mismatched brackets";
    }

    const jsExpression = convert(expression);

    console.log("Converted JS expression:", jsExpression);
    // Double operator check
    if (/[\+\-\*\/\^]{2,}/.test(jsExpression)) {
      return "Invalid operator sequence";
    }

    const result = eval(jsExpression);

    if (isNaN(result)) {
      return "Not a number";
    }

    if (!isFinite(result)) {
      return "Infinity not allowed";
    }

    return result;
  } catch (err) {
    return "Syntax Error";
  }
}


// Add button values to input
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.dataset.value;

    // Replace shorthand values
    if (value === "pi") {
      input.value += "π";
    } else if (value === "e") {
      input.value += "e";
    } else if (value === "sqrt(") {
      input.value += "sqrt(";
    } else {
      input.value += value;
    }
  });
});

// Evaluate button (=)
evaluate.addEventListener("click", () => {
const expression = input.value;
const rawResult = evaluateExpression(expression);
    
    console.log("Raw result:", rawResult);

    if (typeof rawResult === "number") {
  const finalResult = Number(rawResult).toFixed(4);
  output.textContent = "Result: " + finalResult;
} else {
  output.textContent = "Error: " + rawResult;
}

});

// Clear button
clear.addEventListener("click", () => {
  input.value = "";
  output.textContent = "Result: ";
});


document.addEventListener("keydown", function (e) {
  if (e.key === "Tab") {
    e.preventDefault(); // prevent default tabbing behavior
    input.focus();      // focus the input field
    
    const len = input.value.length;
    input.setSelectionRange(len, len);
}
});


document.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault(); // prevent default Enter behavior
    evaluate.click();
  }
});




