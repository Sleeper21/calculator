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

let lastSpot = (displayElem.innerHTML.length) - 1;


//console.log(displayElem.innerHTML)
//console.log(historyDisplay.innerHTML.length)

//// Store a list of all operators
operatorsElementList.forEach(element => {
    const dataOperatorValue = element.getAttribute("data-operator");
    operatorsList.push(dataOperatorValue);      
});


/////////// Functions
function startDisplay(pressedButton){ 
    displayElem.innerHTML = displayElem.innerHTML.slice(0, lastSpot) + pressedButton + displayElem.innerHTML.slice(lastSpot);

}

function addDigitToDisplay(pressedButton){
    let display = displayElem.innerHTML;

    displayElem.innerHTML = display.slice(0, (lastSpot + display.length)) + pressedButton + display.slice(display.length);
}


////////////////////////// handle numbers and point mouse clicks
numberBtnList.forEach(button => {
    button.addEventListener("click", function() {

        const dataValue = button.getAttribute("data-number");
        backspaceBtn.disabled = false;
        lastDigitInserted = dataValue;

        if(displayElem.innerHTML === "0" && dataValue != "0" && dataValue != "."){
            displayElem.innerHTML = "";
            startDisplay(dataValue);
            //console.log(displayElem.innerHTML)

        } else if (displayElem.innerHTML === "0" && dataValue === "0"){
            clearDisplay();
        
           // handle if inserted "." and result is not on screen 
        } else if ( dataValue == "." && displayElem.innerHTML != historyDisplay.innerHTML) {    
            addDigitToDisplay(dataValue);
            document.getElementById("point").disabled = true;

            // handle if inserted "." on top of the result           
        } else if (dataValue == "." && displayElem.innerHTML === historyDisplay.innerHTML) {
            console.log(displayElem.innerHTML)
            console.log(historyDisplay.innerHTML)
            clearDisplay();
            displayElem.innerHTML = "";
            startDisplay(dataValue);

            // Handle if inserted a number on top of result
        } else if (dataValue != "." && displayElem.innerHTML === historyDisplay.innerHTML){
            clearDisplay();
            displayElem.innerHTML = "";
            startDisplay(dataValue);
        } else {
            addDigitToDisplay(dataValue);
            console.log(displayElem.innerHTML);
        }        
            
    });
});

//////////////////////////// Handle operators
operatorsElementList.forEach(button => {
    button.addEventListener("click", function() {

        const operator = button.getAttribute("data-operator");       

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

        } else {
            historyDisplay.innerHTML = historyDisplay.innerHTML.slice(0, (historyDisplay.innerHTML.length -1)) + operator;
            console.log(historyDisplay.innerHTML);
            currentOperator = operator;
        }
        console.log(lastDigitInserted);
        lastDigitInserted = operator;
    })
});

////////////// Calculate
equals.addEventListener("click", function() {
    console.log(currentOperator)
    if (currentOperator){    
        calculate(currentOperator);
    } else {
        displayElem.innerHTML = displayElem.innerHTML;
    }    
});

function calculate(){
    console.log(currentOperator)
    let parcel = historyDisplay.innerHTML.slice(0, (historyDisplay.innerHTML.length - 1));
    let result = 0;
    console.log(parcel)
    console.log(currentOperator)
    console.log(displayElem.innerHTML)


        switch (currentOperator) {
            case "+":
                result = parseFloat(parcel) + parseFloat(displayElem.innerHTML);
                handleResult(result);
                break;
            case "*":
                result = parseFloat(parcel) * parseFloat(displayElem.innerHTML);
                handleResult(result);
                break;

            case "/":
                result = parseFloat(parcel) / parseFloat(displayElem.innerHTML);
                handleResult(result);
                break;
            default:
                result = parseFloat(parcel) - parseFloat(displayElem.innerHTML);
                handleResult(result);
                break;
        }
    return result;
}

//////////////////////////// handle backspace and clear    
allClearBtn.addEventListener("click", function() {
   clearDisplay();
   displayElem.innerHTML = 0;
});

backspaceBtn.addEventListener("click", function() {
        // remove last inserted digit
        displayElem.innerHTML = displayElem.innerHTML.slice(0, (displayElem.innerHTML.length - 1));

        if ( displayElem.innerHTML.length < 1 ) {

            if ( historyDisplay.innerHTML.length > 0 ) {
                displayElem.innerHTML = 0;
            } else{
                clearDisplay();
            }
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
    displayElem.innerHTML = result;
    historyDisplay.innerHTML = displayElem.innerHTML;
    historyDisplay.classList.add("hidden");
    currentOperator = "";
    document.getElementById("point").disabled = false;
    backspaceBtn.disabled = true;
}