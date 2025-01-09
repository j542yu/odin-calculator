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

let hasError = false;

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
    // console.log(`No matching function found for ${binaryOperator}`);
}

const allButtons = document.querySelectorAll("button");

allButtons.forEach((button) => button.addEventListener("click", () => {
    hasError = false;
    handleButtonClick(button);

    populateCurrentDisplay();
    populateExpressionDisplay();

    validateDecimalButton();

    addShadowToButton(button);
}));

function validateDecimalButton() {
    const decimalButton = document.querySelector(".decimal");
    if (hasUserInputDecimalPoint() || (binaryOperator === "equal")) {
        decimalButton.disabled = true;
    } else {
        decimalButton.disabled = false;
    }
}

function addShadowToButton(button) {
    button.classList.add('active');
    setTimeout(() => {
        button.classList.remove('active');
    }, 200);
}

/* display */

function populateCurrentDisplay() {
    let value;

    if (!hasError) {
        if (binaryOperator === null) {
            value = operandOne ?? 0;
        } else {
            value = operandTwo ?? operandOne;
        }
        value = roundNumber(value);
    } else {
        value = "woah there...";
        handleAllClearButtonClick();
    }

    const currentDisplay = document.querySelector(".display .current");
    currentDisplay.textContent = value;
}

function populateExpressionDisplay() {
    const expressionDisplay = document.querySelector(".display .expression");
    let expression = 'Start calculating!';

    if (operandOne !== null) {
        expression = `Calculating: ${roundNumber(operandOne)}`;
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
        expression += ' ' + roundNumber(operandTwo);
    }

    expressionDisplay.textContent = expression;
}

const digitsInDisplay = 15;

function roundNumber(num) {
    function digitsBeforeDecimal(numToRound) {
        if (numToRound < 0) numToRound = -numToRound;
        
        let result = 0;
        
        for (let i = numToRound; i >= 1; i /= 10) {
            ++result;
        }
        return (result > 1) ? result : 1;
    }

    if (!hasUserInputDecimalPoint()) { // don't round off trailing zeros if user is inputting
        if (typeof num !== "number") num = Number(num);

        let decimalPlaces = digitsInDisplay - digitsBeforeDecimal(num);
        const scalingFactor = Math.pow(10, decimalPlaces);

        const adjustedNum = (num * scalingFactor) * (1 + Number.EPSILON);
        let roundedNum = Math.round(adjustedNum) / scalingFactor;

        if (isTooLong(roundedNum) && isInteger(roundedNum)) {
            decimalPlaces = digitsInDisplay - 6;
            roundedNum = roundedNum.toExponential(decimalPlaces);

            giveWarning(`Heyo! ${roundedNum} is too long and will be converted to exponentional form. Accuracy will be lost.`);
        }
        
        return roundedNum;
    } else {
        return num;
    }
}

let warningBox = document.querySelector(".warning");

function giveWarning(message) {
    const body = document.body;

    if (warningBox === null) {
        warningBox = document.createElement("div");
        warningBox.classList.add("warning");
        body.appendChild(warningBox);
    }

    warningBox.textContent = `Warning:\n${message}\n`;

    const confirmButton = document.createElement("button");
    confirmButton.textContent = "OK";

    confirmButton.addEventListener("click", () => {
        removeWarning()
        // console.log("user closed warning popup");
    });

    warningBox.appendChild(confirmButton);

    // console.log("warning popup appeared");
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
    } else if (operatorValue === "percent") {
        operand = percent(operand);
    }
    // console.log(`unaryOperator ${operatorValue} was clicked`);
    return operand;
}

/* calculation button handlers */

function handleButtonClick (button) {
    if (button.classList.contains("operand")) {
        handleOperandButtonClick(button);
        // console.log(`operand ${Number(button.value)} was clicked`);
    } else if (button.classList.contains("unary-operator")) {
        if (operandTwo === null) { 
            operandOne = unaryModifyOperand(button, operandOne)
        } else {
            operandTwo = unaryModifyOperand(button, operandTwo);
        }
    } else if (button.classList.contains("binary-operator")) {
        handleBinaryOperatorButtonClick(button);
        // console.log(`binaryOperator ${button.value} was clicked`);
    } else if (button.classList.contains("CE")) {
        handleClearEntryButtonClick();
        // console.log(`the current operand was cleared`);
    } else if (button.classList.contains("AC")) {
        handleAllClearButtonClick();
        // console.log(`all cleared`);
    } else if (button.classList.contains("decimal")) {
        (binaryOperator !== null) ? operandTwo = addDecimal(operandTwo) : operandOne = addDecimal(operandOne);
        // console.log(`a decimal point was added`);
    }
}

function handleOperandButtonClick(button) {
    const operandValue = Number(button.value);

    if (binaryOperator === null) {
        operandOne = addNewDigitToOperand(operandOne, operandValue);
    } else if (binaryOperator === "equal") { // assume user is starting new calculation
        operandOne = addNewDigitToOperand(null, operandValue);
        binaryOperator = null;
    } else {
        operandTwo = addNewDigitToOperand(operandTwo, operandValue);
    }
}

function isTooLong (num) {
    if (typeof num === "number") num = String(num);
    return num.length >= digitsInDisplay;
}

function isInteger (num) {
    if (typeof num !== "number") num = Number(num);
    return Math.floor(num) === num;
}

function addNewDigitToOperand (operand, newValue) {

    if (operand === null) {
        return newValue;
    } else {
        if (typeof operand === "number") operand = String(operand);

        if (isTooLong(operand)) {
            if (isInteger(operand)){
                    operand = Number(operand) * 10 + Number(newValue);
                    operand = roundNumber(operand);
            } else {
                giveWarning("You can't add anymore digits... it's too long!");
            }
        } else {
            if (typeof newValue === "number") newValue = String(newValue);
            operand = operand + newValue;
        }
    }

    return operand;
}

function handleBinaryOperatorButtonClick(button) {
    let ignoreBinaryOperatorInput = false
    if (operandOne === null) ignoreBinaryOperatorInput = true;

    if (!ignoreBinaryOperatorInput) {
        const binaryOperatorValue = button.value;

        // avoid accidentally converting null to 0 by first checking null
        const divideByZero = (operandTwo !== null) && (Number(operandTwo) === 0) && (binaryOperator === "divide");
        if (divideByZero && (binaryOperatorValue === "equal")) {
            hasError = true;
            return;
        }

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

function addDecimal(operand) {
    if (operand === null) {
        return "0."; 
    } else {
        if (typeof operand === "number") operand = String(operand);
        return operand + '.';
    }
}

function hasUserInputDecimalPoint() {
    if (operandTwo !== null) {
        return String(operandTwo).includes('.');
    } else if (binaryOperator !== null) { // user has yet to enter operandTwo
        return false;
    } else {
        return String(operandOne).includes('.');
    }
}

/* mapping keys to operand and binaryOperator buttons */ 

document.addEventListener('keydown', (e) => {
    let keyboardKey = null;

    // console.log(`${e.key} was pressed on keyboard`);

    if (e.shiftKey) {
        if (e.key === "5") {
            keyboardKey = document.querySelector(`button[data-key='%']`);
        } else if (e.key === "8") {
            keyboardKey = document.querySelector(`button[data-key='*']`);
        } else if (e.key === "Equal") {
            keyboardKey = document.querySelector(`button[data-key='+']`);
        } else if (e.key === "_") { // minus key becomes underscore with shift
            keyboardKey = document.querySelector(`button[data-key='+/-']`);
        }
    }

    if (e.key === "Enter") {
        keyboardKey = document.querySelector(`button[data-key='=']`);
    }

    if (keyboardKey === null) {
        keyboardKey = document.querySelector(`button[data-key='${e.key}']`);
    }

    if (keyboardKey) {
        keyboardKey.click();    
    }
});

/* clearing */

function handleClearEntryButtonClick() {
    if (operandTwo !== null) {
        operandTwo = null;
    } else {
        operandOne = null;
        binaryOperator = null;
    }
    removeWarning();
}

function handleAllClearButtonClick() {
    binaryOperator = null;
    operandOne = null;
    operandTwo = null;
    removeWarning();
}

function removeWarning() {
    if (warningBox !== null) {
        const body = document.body;
        body.removeChild(warningBox);
        warningBox = null;
    }
}