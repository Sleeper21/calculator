let displayElem = document.getElementById("display");
let historyDisplay = document.getElementById("display-history");
let operatorsList = [];
let decimalCheck = [];
let currentOperator = "";
let lastDigitInserted = "";
let result = "";

const numberBtnList = document.querySelectorAll( 'button[data-number]' );
const allClearBtn = document.getElementById("ac-btn");
const backspaceBtn = document.getElementById("backspace-btn");
const operatorsElementList = document.querySelectorAll('button[data-operator]');
const equals = document.getElementById("equals");

// Store a list of all operators
operatorsElementList.forEach(element => {
    const dataOperatorValue = element.getAttribute("data-operator");
    operatorsList.push(dataOperatorValue);      
});


/////////////// Trigger mouse clicks

// Numbers and Decimal
numberBtnList.forEach(button => {
    button.addEventListener("click", function() {

        const dataValue = button.getAttribute("data-number");
        handleNumAndDecimal(dataValue);                    
    });
});

// Operators
operatorsElementList.forEach(button => {
    button.addEventListener("click", function() {

        const operator = button.getAttribute("data-operator");       
        handleOperator(operator);      
    })
});

// Calculate / Submit
equals.addEventListener("click", function() {
    calculate(currentOperator);    
});

// Backspace and AC
allClearBtn.addEventListener("click", function() {
    clearDisplay();
 });
 
 backspaceBtn.addEventListener("click", function() {
    handleBackspace();
 });

//////////////// Trigger Keyboard presses
document.addEventListener("keydown", function(event) {
    let key = event.key;

    // Handle if number 
    if ( ! isNaN(key) ){
        handleNumAndDecimal(key);

    // Handle if decimal is repeated
    } else if ( key === "." ) {
        
        if ( !decimalCheck.includes(".") ){
            decimalCheck.push(key);
            handleNumAndDecimal(key);
        } else {
            displayElem.innerHTML = displayElem.innerHTML;
            historyDisplay.innerHTML = historyDisplay.innerHTML;
        }     

    } else if ( operatorsList.includes(key) ) {
        
        handleOperator(key);

    } else if ( key === "Backspace" || key === "Delete") {
        
        handleBackspace();

    } else if ( key === "Enter" ) {
        event.preventDefault(); // Prevents the browser triggers any selected element
        calculate(currentOperator);
        
    } else {
        displayElem.innerHTML = displayElem.innerHTML;
        historyDisplay.innerHTML = historyDisplay.innerHTML;
    };
});

///////////// Functions
function addDigitToDisplay(pressedButton){
    displayElem.innerHTML += pressedButton;
}

// handle numbers and decimal
function handleNumAndDecimal(dataValue){
    lastDigitInserted = dataValue;
    backspaceBtn.disabled = false;

    if(displayElem.innerHTML === "0" && dataValue != "0" &&dataValue != "."){
        displayElem.innerHTML = "";
        addDigitToDisplay(dataValue);

    } else if ( displayElem.innerHTML === "0" && dataValue=== "0" ) {
        displayElem.innerHTML = 0;

    } else if (displayElem.innerHTML === "0" && dataValue=== "0" && historyDisplay.innerHTML.length === 0){
        clearDisplay();
    
       // handle if inserted "." and result is not on screen 
    } else if ( dataValue === "." && displayElem.innerHTML != historyDisplay.innerHTML) {    
        addDigitToDisplay(dataValue);
        document.getElementById("point").disabled = true;

        // handle if inserted "." on top of the result           
    } else if (dataValue === "." && displayElem.innerHTML === historyDisplay.innerHTML) {
        clearDisplay();
        displayElem.innerHTML = "";
        addDigitToDisplay(dataValue);

        // Handle if inserted a number on top of result
    } else if (dataValue != "." && displayElem.innerHTML === historyDisplay.innerHTML){
        clearDisplay();
        displayElem.innerHTML = "";
        addDigitToDisplay(dataValue);

        // Handle if input goes on top of previous Error
    } else if ( displayElem.innerHTML === "Error" || historyDisplay.innerHTML === "Error" ){
        clearDisplay();
        addDigitToDisplay(dataValue);

    } else {
        addDigitToDisplay(dataValue);            
    };    
};

// Handle operators
function handleOperator(operator){

    // Check if the last input was not an operator
    if ( !operatorsList.includes(lastDigitInserted) ){ 

        // If there are already an operation in curse waiting, calculate the first, show result on historic and start new operation on top of the previous result
        if (currentOperator){
            let preResult = calculate(currentOperator);
            currentOperator = operator;
            historyDisplay.innerHTML = preResult + operator;
            historyDisplay.classList.remove("hidden");
            displayElem.innerHTML = 0;

            // Handle if an operator is inserted on top of Zero
        } else if ( displayElem.innerHTML === "0"){
            if ( operator === "-" ) {
                displayElem.innerHTML = "";
                addDigitToDisplay(operator);
            } else {
                currentOperator = operator;
                historyDisplay.innerHTML = 0 + operator;
                historyDisplay.classList.remove("hidden");
                document.getElementById("point").disabled = false;
            }

        } else {
            currentOperator = operator;
            historyDisplay.innerHTML = displayElem.innerHTML + operator;
            historyDisplay.classList.remove("hidden");
            displayElem.innerHTML = 0;
            document.getElementById("point").disabled = false;
        }
    
    // If last input was an operator, replace that operator for the new operator
    } else {
        historyDisplay.innerHTML = historyDisplay.innerHTML.slice(0, -1) + operator;
        currentOperator = operator;
    }
    lastDigitInserted = operator;
     // Reset decimal check
     decimalCheck = [];
}

// Calculate / Submit
function calculate(currentOperator){

    if ( currentOperator ) {
        let parcel = historyDisplay.innerHTML.slice(0, -1); // all digits excluding the last which is the operator

        switch (currentOperator) {
            case "+":
                result = parseFloat(parcel) + parseFloat(displayElem.innerHTML);
                break;
            case "*":
                result = parseFloat(parcel) * parseFloat(displayElem.innerHTML);
                break;
            case "/":
                result = parseFloat(parcel) / parseFloat(displayElem.innerHTML);
                break;
            case "-":
                result = parseFloat(parcel) - parseFloat(displayElem.innerHTML);
                break;
            default:
                result = displayElem.innerHTML;
                break;
        };
        handleResult(result);
        return result;

    } else {
        displayElem.innerHTML = displayElem.innerHTML;
    }
};

// Backspace
function handleBackspace(){
    if ( displayElem.innerHTML.length > 1 ) {

        if ( displayElem.innerHTML.slice(-1) === "."){
            document.getElementById("point").disabled = false;
            decimalCheck = [];
            displayElem.innerHTML = displayElem.innerHTML.slice(0, -1);

        } else {
            displayElem.innerHTML = displayElem.innerHTML.slice(0, -1);
        }        
        
    } else {
        displayElem.innerHTML = 0;
    }
};

// Clear Display
function clearDisplay() {
    displayElem.innerHTML = "0";
    historyDisplay.innerHTML = "";
    document.getElementById("point").disabled = false;
    backspaceBtn.disabled = false;
    currentOperator = "";
    decimalCheck = [];
};

// Handle Result
function handleResult(result){
    
    if ( ! isFinite(result) ){
        displayElem.innerHTML = "Error";
        historyDisplay.innerHTML = 0;
    } else {
        
        displayElem.innerHTML = "";
        addDigitToDisplay(result);
        historyDisplay.innerHTML = displayElem.innerHTML;
    };
    
    currentOperator = "";
    document.getElementById("point").disabled = false;
    backspaceBtn.disabled = true;
};