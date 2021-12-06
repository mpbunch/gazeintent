// variables to hold the stimulus details
var timeStartTest = ''; // test start time
var timeStopTest = '';  // test stop time (same time as the end of final symbol display time )
var timeStartStim = ''; // time the stimulus appears in the cell
var timeStopStim = '';  // time the stimulus disappears from the screen - either by timeout or by user gazing at active cell

var randomSymbol = '';  // random symbol list
var randomColor = '';   // random color list
var stimSymbol = '';    // single symbol for now, update to a list of 10 symbols

var stimData = []       // dictionary for the stim symbol, color, time and user data points

var stimEventsTotal = 4; // total stimulus events in the test?


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

// Stimulus function - places a random symbol in a random cell for a random duration
function stim() {
    console.log('this is the STIM function');
    
    // how many times will the stim function run


    // randomly select a stimulus symbol and color
    console.log('randomly selecting a stim symbol and color...');
//    randomSymbol = "CIRCLE";
//    randomColor = "RED";

    stimSymbol = '<i class="fas fa-circle"></i>';

    // randomly select a cell id
    console.log('randomly selecting a cell...');
    // var testCellId = '';
    
    // get the div of the randomly selected cell and add the symbol
    console.log('placing symbol into the randomly selected cell...');
    var el = document.getElementById("gaze-1").innerHTML = stimSymbol;

    // record the symbol start time
    timeStartStim = Date.now();

    // wait the randomly selected amount of time, then remove stim symbol
    console.log('start stim display time...')
    setTimeout(() => {
        console.log("stop stim display time...");
        
        // remove the symbol
        el = document.getElementById("gaze-1").innerHTML = '---';
    }, 3000);   // PLACEHOLDER TO SIMULATE RANDOM DELAY TIME
    
    // record the symbol stop time
    // if user gaze touches the active cell
    timeStopStim = Date.now();

    // if symbol duration time runs out before user gaze touch active cell
    timeStopStim = Date.now();



    // save/append stim data to a dictionary
    console.log('saved stimulus event details into a dictionary');

    // APPEND TO stimData

    stimData = [{"meta":{"start":1111,"end":2222},"data":[{"cell":2, "stim":"square", "start":1111, "end":2222, "gaze":1100, "color":"red", "latency":20},{"cell":9, "stim":"square", "start":1111, "end":2222, "gaze":1100, "color":"red", "latency":20},{"cell":4, "stim":"square", "start":1111, "end":2222, "gaze":1100, "color":"red", "latency":20}]}]    // PLACEHOLDER DATA 

    // write dictionary to database
    console.log(stimData);
}



