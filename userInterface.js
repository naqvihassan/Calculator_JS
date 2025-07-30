function focusInputToEnd() {
    input.focus();
    let len = input.value.length;
    input.setSelectionRange(len, len);
}

buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
        input.value += btn.dataset.value;
        focusInputToEnd();
    });
});

backspace.addEventListener("click", function () {
    input.value = input.value.slice(0, -1);
    focusInputToEnd();
});

clear.addEventListener("click", function () {
    input.value = "";
    output.textContent = "Result: ";
});

storeBtn.addEventListener("click", function () {
    if (lastResult === null) {
        output.textContent = "Error: calculate something first to store";
    } else {
        input.value += " => ";
        focusInputToEnd();
    }
});

evaluate.addEventListener("click", function () {
    let expr = input.value;
    let res = handleStoring(expr);

    if (typeof res === "number") {
        output.textContent = "Result: " + res.toFixed(4);
        addToHistory(expr);
    } else if (res === "Empty input") {
        output.textContent = "Result: ";
    } else if (res.startsWith("Stored:")) {
        output.textContent = res;
        addToHistory(expr);
    } else {
        output.textContent = "Error: " + res;
    }
});

memoryBack.addEventListener("click", function () {
    if (history.length === 0) return;
    if (historyIndex > 0) historyIndex--;
    input.value = history[historyIndex];
    focusInputToEnd();
});

memoryForward.addEventListener("click", function () {
    if (history.length === 0) return;
    if (historyIndex < history.length - 1) {
        historyIndex++;
        input.value = history[historyIndex];
    } else {
        historyIndex = history.length;
        input.value = "";
    }
    focusInputToEnd();
});

document.getElementById("all-clear").addEventListener("click", function () {
    history = [];
    historyIndex = -1;
    input.value = "";
    output.textContent = "Result: ";

    for (let key in variables) {
        delete variables[key];
    }
});

input.addEventListener("keydown", function (e) {
    const allowed = [
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
        "+", "-", "*", "/", "(", ")", ".", "^", "x", "y", "z",
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

document.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
        e.preventDefault();
        focusInputToEnd();
    }
});