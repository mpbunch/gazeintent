// variables to hold the stimulus details
var timeStartTest = ''; 
var timeStopTest = '';
var timeStartStim = '';
var timeStopStim = '';
var stimEventsTotal = 4;
var stimCount = 0;
var randomSymbol = '';
var randomColor = '';
var randomCell = '';
var randomDelay = '';
var stimSymbol = '';
var stimData = [];
let symbolList = ["fas fa-circle", "fas fa-square", "fas fa-heart", "fas fa-star", "fas fa-check", "fas fa-compress", "fas fa-crosshairs", "fas fa-dot-circle", "fas fa-ellipsis-h", "fas fa-exclamation"];
let colorList = ["Red", "Orange", "DarkYellow", "Green", "Blue", "Indigo", "Violet", "Turquoise", "Tomato", "SaddleBrown"];

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
    return (Math.floor(Math.random()*4)+1) * 1000;
}

// Stimulus function - places a random symbol in a random cell for a random duration
async function stim() {
    for (let i = 0; i < 5; i++) {
        stimCount++;
        randomDelay = randomDelayFunction();
        randomCell = "gaze-" + (Math.floor(Math.random()*10)+1); 
        
        // get random symbol, color, cell 
        randomSymbol = symbolList[Math.floor(Math.random()*symbolList.length)];
        randomColor = colorList[Math.floor(Math.random()*colorList.length)];
        var stimSymbol = "<i class=" + '"' + randomSymbol + '" ' + " style=" + '"' + "color:" + randomColor + '"' + "></i>";
        if(document.getElementById(randomCell)) {
            document.getElementById(randomCell).innerHTML = stimSymbol;
        } 
        timeStartStim = Date.now();

        // random duration for stimulus symbol to appear in the selected cell
        await sleep(randomDelay);
        
        // replace stimSymbol with empty element in the selected grid cell
        if(document.getElementById(randomCell)) {
            document.getElementById(randomCell).innerHTML = "";
        } 

        // if user gaze touches the active cell
        timeStopStim = Date.now();

        // if symbol duration time runs out before user gaze touch active cell
        timeStopStim = Date.now();

        // save or append stim data to a dictionary
        console.log('saved stimulus event details into a dictionary');

        stimData = [{"meta":{"start":1111,"end":2222},"data":[{"cell":2, "stim":"square", "start":1111, "end":2222, "gaze":1100, "color":"red", "latency":20},{"cell":9, "stim":"square", "start":1111, "end":2222, "gaze":1100, "color":"red", "latency":20},{"cell":4, "stim":"square", "start":1111, "end":2222, "gaze":1100, "color":"red", "latency":20}]}]    // PLACEHOLDER DATA 

        // write dictionary to database
        console.log("WRITE STIM DICTIONARY DATA TO DATABASE" + stimData);

        // random delay between displaying stimulus symbols
        randomDelay = randomDelayFunction();
        await sleep(randomDelay);
    }

    // write dictionary to database
    console.log("WRITE STIM DICTIONARY DATA TO DATABASE");

    alert('Test Completed');
};