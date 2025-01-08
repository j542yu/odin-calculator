/* binary operator functions */
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

/* unary operator functions*/
function percent(a) {
    return Number(a)/100;
}

function changeSign(a) {
    return -Number(a);
}

////////////////////////////////////////////////

let unaryOperator = null;
let binaryOperator = null;
let operandOne = null;
let operandTwo = null;

populateExpressionDisplay();

function binaryOperate(operandOne, binaryOperator, operandTwo) {
    switch (binaryOperator) {
        case "add":
            return add(operandOne, operandTwo);
        case "subtract":
            return subtract(operandOne, operandTwo);
        case "multiply":
            return multiply(operandOne, operandTwo);
        case "divide":
            return divide(operandOne, operandTwo);
        case "equal":
            break;
    }
    console.log(`No matching function found for ${binaryOperator}`);
}

const allButtons = document.querySelectorAll("button");

allButtons.forEach((button) => button.addEventListener("click", () => {
    if ((operandTwo === 0) && (binaryOperator === "divide")) {
        handleAllClearButtonClick();
        populateCurrentDisplay(true);
    } else {
        handleButtonClick(button);
        populateCurrentDisplay(false);
    }
    populateExpressionDisplay();
}));

/* display */

function populateCurrentDisplay(error = false) {
    let value;

    if (!error) {
        if (binaryOperator === null) {
            value = operandOne ?? 0;
        } else {
            value = operandTwo ?? operandOne;
        }
        const digitsInDisplay = 10;
        value = roundNumber(value, digitsInDisplay);
    } else {
        value = "woah there...";
    }

    const currentDisplay = document.querySelector(".display .current");
    currentDisplay.textContent = value;
}

function populateExpressionDisplay() {
    const expressionDisplay = document.querySelector(".display .expression");
    let expression = 'Start calculating!';

    const digitsInDisplay = 4;

    if (operandOne !== null) {
        expression = roundNumber(operandOne, digitsInDisplay);
    }

    if ((binaryOperator !== null) && (binaryOperator !== "equal")) {

        let binaryOperatorSymbol;
        switch (binaryOperator) {
            case "add":
                binaryOperatorSymbol = "+";
                break;
            case "subtract":
                binaryOperatorSymbol = "−";
                break;
            case "multiply":
                binaryOperatorSymbol = "×";
                break;
            case "divide":
                binaryOperatorSymbol = "÷";
        }

        expression += ' ' + binaryOperatorSymbol;
    }

    if (operandTwo !== null) {
        expression += ' ' + roundNumber(operandTwo, digitsInDisplay);
    }

    expressionDisplay.textContent = expression;
}

function roundNumber(num, digitsInDisplay) {
    function digitsBeforeDecimal(num) {
        if (num < 0) num = -num;
        
        let result = 0;
        
        for (let i = num; i >= 1; i /= 10) {
            ++result;
        }
        return (result > 1) ? result : 1;
    }

    const decimalPlaces = digitsInDisplay - digitsBeforeDecimal();
    const scalingFactor = Math.pow(10, decimalPlaces);
    const adjustedNum = (num * scalingFactor) * (1 + Number.EPSILON);
    return Math.round(adjustedNum) / scalingFactor;
}

/* unary operator handler */

function handleUnaryOperatorClick(button) {
    if (operandTwo === null) { 
        operandOne = unaryModifyOperand(button, operandOne)
    } {
        operandTwo = unaryModifyOperand(button, operandTwo);
    }
}

function unaryModifyOperand(button, operand) {
    const operatorValue = button.value;
    if (operatorValue === "change-sign") {
        operand = changeSign(operand);
        console.log(`unaryOperator ${operatorValue} was clicked`);
    } else if (operatorValue === "percent") {
        operand = percent(operand);
        console.log(`unaryOperator ${operatorValue} was clicked`);
    }
    return operand;
}

/* calculation button handlers */

function handleButtonClick (button) {
    if (button.classList.contains("operand")) {
        handleOperandButtonClick(button);
        console.log(`operand ${Number(button.value)} was clicked`);
    } else if (button.classList.contains("unary-operator")) {
        if (operandTwo === null) { 
            operandOne = unaryModifyOperand(button, operandOne)
        } else {
            operandTwo = unaryModifyOperand(button, operandTwo);
        }
    } else if (button.classList.contains("binary-operator")) {
        handleBinaryOperatorButtonClick(button);
        console.log(`binaryOperator ${button.value} was clicked`);
    } else if (button.classList.contains("CE")) {
        handleClearEntryButtonClick();
    } else if (button.classList.contains("AC")) {
        handleAllClearButtonClick();
    }
}

function handleOperandButtonClick(button) {
    const operandValue = Number(button.value);

    if (binaryOperator === null) {
        operandOne = addNewDigitToOperand(operandOne, operandValue);
    } else if (binaryOperator === "equal") {
        operandOne = null;
        operandOne = addNewDigitToOperand(operandOne, operandValue);
    } else {
        operandTwo = addNewDigitToOperand(operandTwo, operandValue);
    }
}

function addNewDigitToOperand (operand, newValue) {
    if (operand === null) {
        return newValue;
    } else {
        operand = String(operand);
        newValue = String(newValue);
        
        operand = operand + newValue;
        
        operand = Number(operand);
    }

    return operand;
}

function handleBinaryOperatorButtonClick(button) {
    let ignoreBinaryOperatorInput = false
    if (operandOne === null) ignoreBinaryOperatorInput = true;

    if (!ignoreBinaryOperatorInput) {
        const binaryOperatorValue = button.value;

        if (operandTwo === null) binaryOperator = binaryOperatorValue;
        else {
            // binaryOperator should not be null as otherwise operandTwo would also be null
            const previousCalculationResult = binaryOperate (operandOne, binaryOperator, operandTwo);
            operandOne = previousCalculationResult;
            binaryOperator = binaryOperatorValue;
            operandTwo = null;
        }
    }
}

/* mapping keys to operand and binaryOperator buttons */ 



/* clearing */

function handleClearEntryButtonClick() {
    if (operandTwo !== null) {
        operandTwo = null;
    } else {
        operandOne = null;
        binaryOperator = null;
    }
}

function handleAllClearButtonClick() {
    binaryOperator = null;
    operandOne = null;
    operandTwo = null;
}