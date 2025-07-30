const variables = {};
let lastResult = null;
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
 



