// variables to hold the stimulus details
var timeTestStart = ''; 
var timeTestStop = '';
var timeStimStart = '';
var timeStimStop = '';
var timeStimGaze = '';
var stimEventsTotal = 1; // Changed to 1 for quicker testing
var stimCount = 0;
var randomSymbol = '';
var randomColor = '';
var randomCell = '';
var randomDelay = '';
var stimSymbol = '';
var stimData = [];

let symbolList = ["fas fa-circle fa-2x", "fas fa-square fa-2x", "fas fa-heart fa-2x", "fas fa-star fa-2x", "fas fa-check fa-2x", "fas fa-compress fa-2x", "fas fa-crosshairs fa-2x", "fas fa-dot-circle fa-2x", "fas fa-ellipsis-h fa-2x", "fas fa-exclamation fa-2x"];
let colorList = ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet", "Turquoise", "Tomato", "SaddleBrown"];

// checkExist copied from webcam.js and edited for the client test page
// Webgazer examples were used as a launching off point for this code block
var checkExist = setInterval(function () {
    // Once the eye location div is loaded, show calibration or test
    if (document.getElementById('webgazerGazeDot')) {
        setTimeout(() => {
            btnStartStim(); 
        }, 3000);
        // clear interval, so only one calibration event is loaded
        clearInterval(checkExist);
    } 
}, 100);

function btnStartStim() {
    let btn = document.createElement("button");
    btn.innerHTML = "Start";
    btn.type="button";
    btn.className="btn btn-success btn-sm";
    btn.id="btnStartTest";

    let msg="Click the button to begin the test";
    document.getElementById("gaze-2").innerHTML = msg;

    const el = document.getElementById("clicker");
    el.appendChild(btn);

    btn.onclick=function () {
        timeTestStart = Date.now();
        btn.remove();
        document.getElementById("gaze-2").innerHTML = '';
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

// Stimulus function - places a random symbol in a random cell for a random duration
async function stim() {
    for (let i = 0; i < stimEventsTotal; i++) {
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
        timeStimStart = Date.now();

        // random duration for stimulus symbol to appear in the selected cell
        await sleep(randomDelay);
        
        // replace stimSymbol with empty element in the selected grid cell
        if(document.getElementById(randomCell)) {
            document.getElementById(randomCell).innerHTML = "";
        } 

        // if user gaze touches the active cell
        timeStimStop = Date.now();

        // if symbol duration time runs out before user gaze touch active cell
        timeStimStop = Date.now();
        timeStimGaze = timeStimStop - timeStimStart;

        // add stimulus details to an array
        stimData.push({
            cell: randomCell,
            stim: randomSymbol,
            color: randomColor,
            start: timeStimStart,
            end: timeStimStop,
            gaze: timeStimGaze
        })

        console.log(JSON.stringify(stimData));
        // random delay between displaying stimulus symbols
        randomDelay = randomDelayFunction();
        await sleep(randomDelay);
    }

    timeTestStop = Date.now();
    let payload = {
        cache: "no-cache",
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            meta: {
                'start': timeTestStart,
                'end': timeTestStop
            },
            data:stimData,
            type: "test"
        })
    }
    fetch(`/api/calibrate`, payload)
        .then(response => {
            return response.text();
        }).then(() => {
           // sleep(4000).then(() => window.location.href = "/client?c=1&h=1")
        });

    let msg="Test Completed <br><br> Details have been saved to the database. <br><br>Thank you for participating.";
    document.getElementById("gaze-2").innerHTML = msg;
};