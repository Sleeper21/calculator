// FIX BUTTON ANIMATION
let displayElem = document.getElementById("display");
let numberBtnElem = document.querySelectorAll( 'button[data = "number"]' );
const allClearBtn = document.getElementById("ac-btn");
const backspaceBtn = document.getElementById("backspace-btn");

let numberPressed = [];
displayElem.innerHTML = "0";
const lastSpot = (displayElem.innerHTML.length) - 1;

//console.log(lastSpot)
console.log(displayElem.innerHTML)


function startDisplay(pressedButton){ 
    numberPressed.push(pressedButton.innerHTML);
    numberPressed.forEach(digit => {
        displayElem.innerHTML = displayElem.innerHTML.slice(0, lastSpot) + digit + displayElem.innerHTML.slice(lastSpot);
    });    
}

function addDigitToDisplay(pressedButton){
    numberPressed.push(pressedButton.innerHTML);
    displayElem.innerHTML = displayElem.innerHTML.slice(0, (lastSpot + numberPressed.length)) + pressedButton.innerHTML + displayElem.innerHTML.slice(numberPressed.length);
}


////////////////////////// handle number mouse clicks
numberBtnElem.forEach(button => {
    button.addEventListener("click", function() {
        
        if(displayElem.innerHTML === "0" && button.innerHTML != "0"){
            displayElem.innerHTML = "";
            buttonVisualBehavior(button);
            startDisplay(button);
            console.log(displayElem.innerHTML)
            console.log(numberPressed)

        } else if (displayElem.innerHTML === "0" && button.innerHTML === "0"){
            buttonVisualBehavior(button);
            clearDisplay();

        } else{
            buttonVisualBehavior(button);
            addDigitToDisplay(button);
            console.log(displayElem.innerHTML)
            console.log(numberPressed)
        }        
    });
});

//////////////////////////// handle backspace and clear    
allClearBtn.addEventListener("click", function() {
   buttonVisualBehavior(this);
   clearDisplay();
});

backspaceBtn.addEventListener("click", function() {
    buttonVisualBehavior(this);
        numberPressed.pop();
        displayElem.innerHTML = displayElem.innerHTML.slice(0, (displayElem.innerHTML.length - 1));
        if(displayElem.innerHTML.length < 1) {
            clearDisplay();
        }
});

function clearDisplay() {
    numberPressed = [];
    displayElem.innerHTML = "0";
}

//// button animation
function buttonVisualBehavior(button){ 
    console.log(button.classList.value)  
    button.classlist.value.push("animate");

    setTimeout(() => {
        button.ClassList.remove("animate");
        console.log(button.classList)
    }, "50");   
}