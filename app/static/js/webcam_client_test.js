import { gridBuilder } from "./ml_client_test.js";

(async function () {
    console.log('Webgazer is alive FOR THE CLIENT TEST PAGE!');
    var grid, data, cells, div;
    div = 'gazeGrid';
    cells = 9;
    data = {}
    data.x = 0;
    data.y = 0;
    grid = new gridBuilder();
    grid.loading(true, div);


    // REMOVE THIS SETUP FUNCTION, NOT NEEDED FOR CLIENT TEST
        /*     //Set up the webgazer video feedback.
            var setup = function () {

                //Set up the main canvas. The main canvas is used to calibrate the webgazer.
                var canvas = document.getElementById("plotting_canvas");
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                canvas.style.position = 'fixed';
            };
            setup(); */


    // Webgazer examples were used as a launching off point for this code block
    var checkExist = setInterval(function () {
        // Once the eye location div is loaded, show calibration or test
        if (document.getElementById('webgazerGazeDot')) {
            setTimeout(() => {
                console.log('Webgazer Loaded IN THE CLIENT TEST PAGE!');
                // turn off loading wheel
                grid.loading(false, div);
                // make the grid
                grid.makeGrid();
            }, 3000);
            // clear interval, so only one calibration event is loaded
            clearInterval(checkExist);
        }
    }, 100);

    webgazer.params.showVideoPreview = false;
    //start the webgazer tracker
    await webgazer.setRegression('ridge') /* currently must set regression and tracker */
        //.setTracker('clmtrackr')
        .setGazeListener(function (data, clock) {
            // console.log(data); /* data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting) */
            // console.log(clock); /* elapsed time in milliseconds since webgazer.begin() was called */

            // init calibration
            grid.calibrate(cells, div, data)
        })
        .saveDataAcrossSessions(true)
        .begin();

// TURN OFF VIDEO PREVIEW FOR CLIENT TESTN PAGE
    await webgazer.showVideoPreview(false) /* shows all video previews */
        .showPredictionPoints(true) /* shows a square every 100 milliseconds where current prediction is */
        .applyKalmanFilter(true); /* Kalman Filter defaults to on. Can be toggled by user. */

    window.saveDataAcrossSessions = true;
    window.onbeforeunload = () => {
        webgazer.end();
    }

})(webgazer, gridBuilder);

console.log("@@@@@@@@@@@@@@@@@@@@" + Date.now());
