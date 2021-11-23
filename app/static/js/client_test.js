
// ml_util is work in progress
// copied and edited from mb_utils

import { doGaze } from "./ml_util.js";

(function () {
    let gaze = new doGaze();
    // Show loading wheel wile webgazer is being loaded
    gaze.loading();
    // wait for webgazer before calibration grid load
    var checkExist = setInterval(function () {
        // Once the eye location div is loaded, show calibration or test
        if (document.getElementById('webgazerGazeDot')) {
            console.log('Webgazer Loaded!');
            // turn off loading wheel
            gaze.loading(false);
            // init test
            let test = gaze.test();
            // start test
            test.start();
            // clear interval, so only one test event is loaded
            clearInterval(checkExist);
        }
    }, 100);
})(doGaze);

/**
// Create grid using gazeCell
import { gazeCell } from "./util.js";

(function () {
    const grid = document.querySelector('#gazeGrid');
    for (let i = 1; i < 10; ++i) {
        const cell = new gazeCell(i);
        grid.appendChild(cell.element)
    }
})(gazeCell);


// Get a random cell id
var min = 1
var max = 9
var randomCell = Math.floor(Math.random() * (max - min + 1) + min);
console.log('randomCell-----------------> ' + randomCell);

// Create svg element in the selected cell
var svg = document.createElementNS('svg', 'svg');
svg.setAttribute('id', 'stimCell');
document.getElementById(randomCell).appendChild(svg);


// Add symbol to the selected cell
document.getElementById(randomCell).style.backgroundColor = 'green';
document.getElementById(randomCell).innerHTML += 'test';

 */