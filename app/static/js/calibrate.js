import { gridBuilder } from "./mb_calibrate.js";

(async function () {
    var grid, data, cells, div;
    div = 'gazeGrid';
    cells = 9;
    data = {}
    data.x = 0;
    data.y = 0;
    grid = new gridBuilder();
    grid.loading(true, div);
    //Set up the webgazer video feedback.
    var setup = function () {

        //Set up the main canvas. The main canvas is used to calibrate the webgazer.
        var canvas = document.getElementById("plotting_canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'fixed';
    };
    setup();
    // Webgazer examples were used as a launching off point for this code block
    var checkExist = setInterval(function () {
        // Once the eye location div is loaded, show calibration or test
        if (document.getElementById('webgazerGazeDot')) {
            setTimeout(() => {
                // turn off loading wheel
                grid.loading(false, div);
                // make the grid
                grid.makeGrid();
            }, 3000);
            // clear interval, so only one calibration event is loaded
            clearInterval(checkExist);
        }
    }, 100);
    // enable the live preview
    webgazer.params.showVideoPreview = true;
    //start the webgazer tracker
    await webgazer.setRegression('ridge') /* currently must set regression and tracker */
        //.setTracker('clmtrackr')
        .setGazeListener(function (data, clock) {
            // init calibration
            grid.calibrate(cells, div, data)
        })
        .saveDataAcrossSessions(true)
        .begin();
    await webgazer.showVideoPreview(true) /* shows all video previews */
        .showPredictionPoints(true) /* shows a square every 100 milliseconds where current prediction is */
        .applyKalmanFilter(true); /* Kalman Filter defaults to on. Can be toggled by user. */
    window.saveDataAcrossSessions = true;
    window.onbeforeunload = () => {
        webgazer.end();
    }
})(webgazer, gridBuilder);