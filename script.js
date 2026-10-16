const currentDisplay = document.getElementById("current-display");
const previousDisplay = document.getElementById("previous-display");

let currentValue = "";
let previousValue = "";
let operation = null;


// ================= DISPLAY =================

function updateDisplay() {

    currentDisplay.textContent = currentValue || "0";

    if (operation !== null) {
        previousDisplay.textContent =
            `${previousValue} ${getOperationSymbol(operation)}`;
    } else {
        previousDisplay.textContent = "";
    }
}


// ================= OPERATOR SYMBOL =================

function getOperationSymbol(operator) {

    if (operator === "*") return "×";
    if (operator === "/") return "÷";
    if (operator === "-") return "−";
    if (operator === "+") return "+";

    return operator;
}


// ================= NUMBER =================

function appendNumber(number) {

    if (number === "." && currentValue.includes(".")) {
        return;
    }

    if (number === "." && currentValue === "") {
        currentValue = "0";
    }

    currentValue += number;

    updateDisplay();
}


// ================= OPERATION =================

function chooseOperation(selectedOperation) {

    if (currentValue === "" && previousValue === "") {
        return;
    }

    if (currentValue === "" && previousValue !== "") {
        operation = selectedOperation;
        updateDisplay();
        return;
    }

    if (previousValue !== "" && operation !== null) {
        calculate();
    }

    previousValue = currentValue;
    currentValue = "";
    operation = selectedOperation;

    updateDisplay();
}


// ================= CALCULATE =================

function calculate() {

    if (previousValue === "" || currentValue === "" || operation === null) {
        return;
    }

    const previous = parseFloat(previousValue);
    const current = parseFloat(currentValue);

    let result;

    switch (operation) {

        case "+":
            result = previous + current;
            break;

        case "-":
            result = previous - current;
            break;

        case "*":
            result = previous * current;
            break;

        case "/":

            if (current === 0) {
                currentValue = "Error";
                previousValue = "";
                operation = null;
                updateDisplay();
                return;
            }

            result = previous / current;
            break;

        default:
            return;
    }

    result = Math.round((result + Number.EPSILON) * 100000000) / 100000000;

    currentValue = result.toString();
    previousValue = "";
    operation = null;

    updateDisplay();
}


// ================= CLEAR =================

function clearCalculator() {

    currentValue = "";
    previousValue = "";
    operation = null;

    updateDisplay();
}


// ================= DELETE =================

function deleteNumber() {

    currentValue = currentValue.slice(0, -1);

    updateDisplay();
}


// ================= PERCENTAGE =================

function percentage() {

    if (currentValue === "") {
        return;
    }

    currentValue = (parseFloat(currentValue) / 100).toString();

    updateDisplay();
}


// ================= BUTTON EVENTS =================

document.querySelectorAll("[data-number]").forEach(button => {

    button.addEventListener("click", () => {

        appendNumber(button.dataset.number);

    });

});


document.querySelectorAll("[data-operation]").forEach(button => {

    button.addEventListener("click", () => {

        chooseOperation(button.dataset.operation);

    });

});


document.querySelector('[data-action="calculate"]')
    .addEventListener("click", calculate);


document.querySelector('[data-action="clear"]')
    .addEventListener("click", clearCalculator);


document.querySelector('[data-action="delete"]')
    .addEventListener("click", deleteNumber);


document.querySelector('[data-action="percentage"]')
    .addEventListener("click", percentage);


// ================= KEYBOARD SUPPORT =================

document.addEventListener("keydown", event => {

    const key = event.key;

    if (
        !isNaN(key) ||
        key === "."
    ) {
        appendNumber(key);
    }

    if (
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/"
    ) {
        chooseOperation(key);
    }

    if (key === "Enter" || key === "=") {
        calculate();
    }

    if (key === "Escape") {
        clearCalculator();
    }

    if (key === "Backspace") {
        deleteNumber();
    }

    if (key === "%") {
        percentage();
    }

});