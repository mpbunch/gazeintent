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
    return (Math.floor(Math.random()*3)+0) * 1000;
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

    calibrate = (grid_cells = 9, div = 'gazeGrid', actual_gaze = false) => {
        if (!actual_gaze) return
        // get active calibartion cell
        let active_cell = document.querySelector(`.active-cell`);
        if (!active_cell) return
        if (active_cell.id == 'gaze-1') active_cell.dataset.start = Date.now();
        let position = active_cell.dataset.position.split(',');
        let cell_position = [position[0], position[1], [position[2], position[3]]];

        let size = 3;
        let gaze_position = [[actual_gaze.x, size], [actual_gaze.y, size]];
        let hit = this.collision(cell_position, gaze_position);
        // if gaze hits active cell
        // add dataset.gazed += 1
        // if dataset.gazed == 5
        // advance to next cell
        let threshold = 10;
        let active_cell_gazed = parseInt(active_cell.dataset.gazed);
        var rect = active_cell.getBoundingClientRect();
        let x = rect.x + active_cell.offsetWidth / 2;
        let y = rect.y + active_cell.offsetHeight / 2;
        var clicker = document.querySelector('#clicker');
        clicker.setAttribute('style', `left: ${x}px; top: ${y}px`)
        if (hit && active_cell_gazed < threshold) {
            // calibration is working
            active_cell.dataset.gazed = active_cell_gazed ? active_cell_gazed + 1 : 1
            // click
            // document.elementFromPoint(x, y).click();
        } else if (hit && active_cell_gazed >= threshold) {
            // advance calibration
            this.advance(active_cell, grid_cells)
        }
    }

    sleep(5000).then(() => {
        stop_storing_points_variable(); // stop storing the prediction points
        var past50 = webgazer.getStoredPoints(); // retrieve the stored points
        var precision_measurement = calculatePrecision(past50);
        var accuracyLabel = "<a>Accuracy | " + precision_measurement + "%</a>";
        var accuracy_div = document.querySelector("#accuracy");
        accuracy_div.innerHTML = accuracyLabel; // Show the accuracy in the nav bar.
        accuracy_div.style.display = 'initial';
        // write some data to the db
        // how do we keep track of start time
        // how do we get time ellapsed
        // write a timestamp to some dataset.start
        // new date.now() - start
        // convert to seconds
        // save start, end, diff_in_sec

        var start = parseInt(document.querySelector('#gaze-1').dataset.start);
        var diff = end - start;
        let payload = {
            cache: "no-cache",
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'calibration',
                accuracy: precision_measurement,
                start: start,
                end: end,
                diff: diff
            })
        }
        fetch(`/api/calibrate`, payload)
            .then(response => {
                return response.text();
            }).then(text => {
                // error
            });
    });

    collision = (p1, p2) => {
        var r1, r2;
        r1 = p1[0] < p2[0] ? p1 : p2;
        r2 = p1[0] < p2[0] ? p2 : p1;
        return r1[1] > r2[0] || r1[0] === r2[0];
    }

    get_position = (elem) => {
        var pos, width, height;
        pos = elem.getBoundingClientRect();
        width = elem.offsetWidth / 2;
        height = elem.offsetHeight;
        return [[pos.left, pos.left + width], [pos.top, pos.top + height]];
    }

