// variables to hold the stimulus details
var timeStartTest = ''; // test start time
var timeStopTest = '';  // test stop time (same time as the end of final symbol display time )
var timeStartStim = ''; // time the stimulus appears in the cell
var timeStopStim = '';  // time the stimulus disappears from the screen - either by timeout or by user gazing at active cell

// var symbolList = Array("fas fa-circle", "fas fa-square", "fas fa-heart", "fas fa-star");  // list of symbols
// var colorList = Array("#ff0000", "#00ff00", "#0000ff");  // list of colors
let symbolList = ["fas fa-circle", "fas fa-square", "fas fa-heart", "fas fa-star", "fas fa-check", "fas fa-compress", "fas fa-crosshairs", "fas fa-dot-circle", "fas fa-ellipsis-h", "fas fa-exclamation"];  // list of symbols
let colorList = ["Red", "Orange", "DarkYellow", "Green", "Blue", "Indigo", "Violet", "Turquoise", "Tomato", "SaddleBrown"];  // list of colors
var randomSymbol = '';  // randomly selected symbol
var randomColor = '';   // randomly selected color
var randomCell = '';    // randomly selected grid cell
var randomDelay = '';   // randomly selected delay time between stimulus symbols display
var stimSymbol = '';    // single symbol for dev testing, update to a list of 10 symbols


var stimData = []       // dictionary for the stim symbol, color, time and user data points

var stimEventsTotal = 4; // total stimulus events in the test?
var stimCount = 0;      // Current count of the number of times a the stimulus placement function has run


// checkExist copied from webcam.js and edited for the client test page
// Webgazer examples were used as a launching off point for this code block
var checkExist = setInterval(function () {
    // Once the eye location div is loaded, show calibration or test
    if (document.getElementById('webgazerGazeDot')) {
        setTimeout(() => {
            console.log('Webgazer Loaded IN THE CLIENT TEST PAGE!');
            btnStartStim(); 
        }, 3000);
        // clear interval, so only one calibration event is loaded
        clearInterval(checkExist);
    } 
}, 100);

// add the start button once the gazer dot div is loaded
function btnStartStim() {
    // Create a button to start the test
    let btn = document.createElement("button");
    btn.innerHTML = "Start";
    btn.type="button";
    btn.className="btn btn-success btn-sm";
    btn.id="btnStartTest";

    // change this to wait until webgazer is loaded
    const el = document.getElementById("clicker");
    el.appendChild(btn);

    // Start button onclick function
    btn.onclick=function () {
        timeStartTest = Date.now();
        console.log(timeStartTest);

        // remove button once it is clicked and the test has started
        btn.remove();

        // start stim function
        stim();
    };
};
  
// Sleep function - wait the selected amount of time, then remove stim symbol
// modified from:
// https://stackoverflow.com/questions/64995893/add-timeout-sleep-function-inside-javascript-loop
// and from mb_calibrate -> sleep function because javascript doesn't have one,
// sourced from http://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function randomDelayFunction() {
    return (Math.floor(Math.random()*5)+2) * 1000;
}
``
// Stimulus function - places a random symbol in a random cell for a random duration
async function stim() {
    for (let i = 0; i < 5; i++) {
        stimCount++;
        console.log('=============this is the STIM function cycle: #' + stimCount);
            
        // randomly select a stimulus grid cell, symbol, color, delay time
        console.log('randomly selecting a stim symbol and color...');
        
        // random delay time from 2 to 5 seconds
        // randomDelay = (Math.floor(Math.random()*5)+2) * 1000;
        randomDelay = randomDelayFunction();
        console.log('$$$$$$$$$$$$$$$$$$$$$$$$ RANDOM DELAY: ' + randomDelay);
        
        // random cell - hard coded for 9 cell grid, update to get # of cells dynamically 
        randomCell = "gaze-" + (Math.floor(Math.random()*10)+1); 
        console.log("randomly selected cell: " + randomCell);
        
        // random symbol
        randomSymbol = symbolList[Math.floor(Math.random()*symbolList.length)];
        console.log("randomly selected symbol: " + randomSymbol);
        
        // random color
        randomColor = colorList[Math.floor(Math.random()*colorList.length)];
        console.log("randomly selected color: " + randomColor);
        
        // combine random symbol and color into the stimulus symbol
        var stimSymbol = "<i class=" + '"' + randomSymbol + '" ' + " style=" + '"' + "color:" + randomColor + '"' + "></i>";
        console.log("stimSymbol: " + stimSymbol);

        // get the div of the randomly selected cell and add the symbol
        if(document.getElementById(randomCell)) {
            document.getElementById(randomCell).innerHTML = stimSymbol;
        } 

        // record the symbol start time
        timeStartStim = Date.now();
        console.log("stim display start time: " + timeStartStim);
        
        // random duration for stimulus symbol to appear in the selected cell
        await sleep(randomDelay);
        
        // replace stimSymbol with empty element in the selected grid cell
        if(document.getElementById(randomCell)) {
            document.getElementById(randomCell).innerHTML = "";
        } 
        // record the symbol stop time
        // if user gaze touches the active cell
        timeStopStim = Date.now();

        // if symbol duration time runs out before user gaze touch active cell
        timeStopStim = Date.now();

        // save or append stim data to a dictionary
        console.log('saved stimulus event details into a dictionary ****************************');

        stimData = [{"meta":{"start":1111,"end":2222},"data":[{"cell":2, "stim":"square", "start":1111, "end":2222, "gaze":1100, "color":"red", "latency":20},{"cell":9, "stim":"square", "start":1111, "end":2222, "gaze":1100, "color":"red", "latency":20},{"cell":4, "stim":"square", "start":1111, "end":2222, "gaze":1100, "color":"red", "latency":20}]}]    // PLACEHOLDER DATA 

        // write dictionary to database
        console.log("WRITE STIM DICTIONARY DATA TO DATABASE");

        // random delay between displaying stimulus symbols
        randomDelay = randomDelayFunction();
        await sleep(randomDelay);
    }

    // write dictionary to database
    console.log("WRITE STIM DICTIONARY DATA TO DATABASE");

    alert('TEST IS DONE');
};

