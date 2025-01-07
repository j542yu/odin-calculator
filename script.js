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
    if ((operandTwo === 0) && (operator === "divide")) {
        populateCurrentDisplay(true);
        handleAllClearButtonClick();
    } else {
        handleButtonClick(button);
        populateCurrentDisplay(false);
    }
}));

/* display */

function populateCurrentDisplay(error = false) {
    let value;

    if (!error) {
        if (operator === null) {
            value = operandOne ?? 0;
        } else {
            value = operandTwo ?? operandOne;
        }
        value = roundNumber(value, 4);
    } else {
        value = "woah there...";
    }

    const currentDisplay = document.querySelector(".display .current");
    currentDisplay.textContent = value;
}

function roundNumber(num, decimalPlaces = 0) {
    const scalingFactor = Math.pow(10, decimalPlaces);
    const adjustedNum = (num * scalingFactor) * (1 + Number.EPSILON);
    return Math.round(adjustedNum) / scalingFactor;
}

/* calculation button handlers */

function handleButtonClick (button) {
    if (button.classList.contains("operand")) {
        handleOperandButtonClick(button);
        console.log(`operand ${Number(button.value)} was clicked`);
    } else if (button.classList.contains("operator")) {
        handleOperatorButtonClick(button);
        console.log(`operator ${button.value} was clicked`);
    } else if (button.classList.contains("CE")) {
        handleClearEntryButtonClick();
    } else if (button.classList.contains("AC")) {
        handleAllClearButtonClick();
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

/* clearing */

function handleClearEntryButtonClick() {
    if (operandTwo !== null) {
        operandTwo = null;
    } else {
        operandOne = null;
        operator = null;
    }
}

function handleAllClearButtonClick() {
    operator = null;
    operandOne = null;
    operandTwo = null;
}