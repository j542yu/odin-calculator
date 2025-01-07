/* operator functions */
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

/* button handlers */

let operator = null;
let operandOne = null;
let operandTwo = null;

function operate(operandOne, operator, operandTwo) {
    if (typeof operator === "string") {
        switch (operator) {
            case "add":
                operator = add;
                break;
            case "subtract":
                operator = subtract;
                break;
            case "multiply":
                operator = multiply;
                break;
            case "divide":
                operator = divide;
                break;
        }
    }
    return operator(operandOne, operandTwo);
}

const allButtons = document.querySelectorAll("button");

allButtons.forEach((button) => button.addEventListener("click", () => {
    handleButtonClick(button);
    populateCurrentDisplay();
}));

function populateCurrentDisplay() {
    let value;
    if (operator === null) {
        value = operandOne || 0;
    } else {
        value = operandTwo || operandOne;
    }
    const currentDisplay = document.querySelector(".display .current");
    currentDisplay.textContent = value;
}

function handleButtonClick (button) {
    if (button.classList.contains("operand")) {
        handleOperandButtonClick(button);
        console.log(`operand ${button.value} was clicked`);
    } else if (button.classList.contains("operator")) {
        handleOperatorButtonClick(button);
        console.log(`operator ${button.value} was clicked`);
    }
}

function handleOperandButtonClick(button) {
    const operandValue = Number(button.value);

    if (operator === null) {
        const newDigitAddedToOperand = operandOne * 10 + operandValue;
        operandOne = newDigitAddedToOperand;
    } else {
        const newDigitAddedToOperand = operandTwo * 10 + operandValue;
        operandTwo = newDigitAddedToOperand;
    }
}

function handleOperatorButtonClick(button) {
    let ignoreOperatorInput = false
    if (operandOne === null) ignoreOperatorInput = true;

    if (!ignoreOperatorInput) {
        const operatorValue = button.value;

        if (operandTwo === null) operator = operatorValue;
        else {
            // operator should not be null as otherwise operandTwo would also be null
            const previousCalculationResult = operate (operandOne, operator, operandTwo);
            operandOne = previousCalculationResult;
            operator = operatorValue;
            operandTwo = null;
        }
    }

}