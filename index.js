let displayElem = document.getElementById("display");
let historyDisplay = document.getElementById("display-history");
let operatorsList = [];
let currentOperator = "";
let lastDigitInserted = "";

const numberBtnList = document.querySelectorAll( 'button[data-number]' );
const allClearBtn = document.getElementById("ac-btn");
const backspaceBtn = document.getElementById("backspace-btn");
const operatorsElementList = document.querySelectorAll('button[data-operator]');
const equals = document.getElementById("equals");

//// Store a list of all operators
operatorsElementList.forEach(element => {
    const dataOperatorValue = element.getAttribute("data-operator");
    operatorsList.push(dataOperatorValue);      
});


/////////// Functions
function addDigitToDisplay(pressedButton){
    displayElem.innerHTML += pressedButton;
}


////////////////////////// handle numbers and point mouse clicks
numberBtnList.forEach(button => {
    button.addEventListener("click", function() {

        const dataValue = button.getAttribute("data-number");
        backspaceBtn.disabled = false;
        lastDigitInserted = dataValue;

        if(displayElem.innerHTML === "0" && dataValue != "0" && dataValue != "."){
            displayElem.innerHTML = "";
            addDigitToDisplay(dataValue);

        } else if ( displayElem.innerHTML === "0" && dataValue === "0" ) {
            displayElem.innerHTML = 0;
        } else if (displayElem.innerHTML === "0" && dataValue === "0" && historyDisplay.innerHTML.length === 0){
            clearDisplay();
        
           // handle if inserted "." and result is not on screen 
        } else if ( dataValue == "." && displayElem.innerHTML != historyDisplay.innerHTML) {    
            addDigitToDisplay(dataValue);
            document.getElementById("point").disabled = true;

            // handle if inserted "." on top of the result           
        } else if (dataValue == "." && displayElem.innerHTML === historyDisplay.innerHTML) {
            clearDisplay();
            displayElem.innerHTML = "";
            addDigitToDisplay(dataValue);

            // Handle if inserted a number on top of result
        } else if (dataValue != "." && displayElem.innerHTML === historyDisplay.innerHTML){
            clearDisplay();
            displayElem.innerHTML = "";
            addDigitToDisplay(dataValue);
        } else {
            addDigitToDisplay(dataValue);            
        }           
    });
});

//////////////////////////// Handle operators
operatorsElementList.forEach(button => {
    button.addEventListener("click", function() {

        const operator = button.getAttribute("data-operator");       

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
                currentOperator = operator;
                historyDisplay.innerHTML = 0 + operator;
                historyDisplay.classList.remove("hidden");
                document.getElementById("point").disabled = false;
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
    })
});

////////////// Calculate
equals.addEventListener("click", function() {
    if (currentOperator){    
        calculate(currentOperator);
    } else {
        displayElem.innerHTML = displayElem.innerHTML;
    }    
});

function calculate(){
    let parcel = historyDisplay.innerHTML.slice(0, -1); // all digits excluding the last which is the operator
    let result = 0;
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
            default:
                result = parseFloat(parcel) - parseFloat(displayElem.innerHTML);
                break;
        }
    handleResult(result);
    return result;
}

//////////////////////////// handle backspace and AC    
allClearBtn.addEventListener("click", function() {
   clearDisplay();
});

backspaceBtn.addEventListener("click", function() {
        if ( displayElem.innerHTML.length > 1 ) {
            displayElem.innerHTML = displayElem.innerHTML.slice(0, -1);
        } else {
            displayElem.innerHTML = 0;
        }
});

function clearDisplay() {
    displayElem.innerHTML = 0;
    historyDisplay.innerHTML = 0;
    historyDisplay.classList.add("hidden");
    document.getElementById("point").disabled = false;
    backspaceBtn.disabled = false;
    currentOperator = "";
};

function handleResult(result){

    if ( ! isFinite(result) ){
        displayElem.innerHTML = "Error";
        historyDisplay.innerHTML = 0;
    } else {
        displayElem.innerHTML = result;
        historyDisplay.innerHTML = displayElem.innerHTML;
    };
    
    historyDisplay.classList.add("hidden");
    currentOperator = "";
    document.getElementById("point").disabled = false;
    backspaceBtn.disabled = true;
};