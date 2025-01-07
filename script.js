function add(a, b) {
    return Number(a) + Number(b);
}

function subtract(a, b) {
    return Number(a) - Number(b);
}

function multiply(a, b) {
    return Number(a) * Number(b);
}

function divide(dividend, divisor) {
    dividend = Number(dividend);
    divisor = Number(divisor);

    if (divisor !== 0) {
        return dividend/divisor;  
    }
}

let operator = null;
let operandOne = null;
let operandTwo = null;

function operate(operandOne, operator, operandTwo) {
    return operator(operandOne, operandTwo);
}

const allOperands = document.querySelectorAll(".operand");

allOperands.forEach((button) => button.addEventListener("click", () => populateCurrentDisplay(button)));

function populateCurrentDisplay(input) {
    if (typeof input !== "number") {
        input = Number(input.textContent);
    }
    const currentDisplay = document.querySelector(".display .current");
    currentDisplay.textContent = input;
}