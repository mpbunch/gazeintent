// variable to hold the stimulus details
var timeStartTest = '1';
var timeStopTest = '2';
var timeStartStim = '3';
var timeStopStim = '4';

// Create a button to start the test
let btn = document.createElement("button");
btn.innerHTML = "Start the Test";
btn.type="button";
btn.class="btn btn-success btn-sm";
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

// Stimulus function - places a random symbol in a random cell for a random duration
function stim() {
    console.log('this is the STIM function');

    // randomly select a cell id

    // get the div of the randomly selected cell and add the symbol
    var e = document.getElementById("gaze-1");
    e.innerHTML = 'symbol';

    // record the symbol start time
    timeStartStim = Date.now();

    // wait the randomly selected amount of time
    console.log('starting delay time')
    setTimeout(() => {  console.log("end delay time"); }, 4000);   // PLACEHOLDER TO SIMULATE RANDOM DELAY TIME
    
    // record the symbol stop time
        // if user gaze touches the active cell
        timeStopStim = Date.now();
        // if symbol duration time runs out before user gaze touch active cell
        timeStopStim = Date.now();

    // remove the symbol
    e.innerHTML = ''

    // save/append stim data to a dictionary
    var stimData = []
    stimData = [{"test_id":1,"user_id":20,"start":0,"end":1},{"test_id":1,"user_id":20,"start":0,"end":1}]    // PLACEHOLDER DATA 

    // write dictionary to database
}



