import { gridBuilder } from "./mb_calibrate.js";

(async function () {
    console.log('Webgazer is alive!');
    var grid, data, cells, div;
    div = 'gazeGrid';
    cells = 9;
    data = {}
    data.x = 0;
    data.y = 0;
    grid = new gridBuilder();
    grid.loading(true, div);

    webgazer.params.showVideoPreview = true;
    //start the webgazer tracker
    await webgazer.setRegression('ridge') /* currently must set regression and tracker */
        //.setTracker('clmtrackr')
        .setGazeListener(function (data, clock) {
            //   console.log(data); /* data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting) */
            //   console.log(clock); /* elapsed time in milliseconds since webgazer.begin() was called */
        })
        .saveDataAcrossSessions(true)
        .begin();
    webgazer.showVideoPreview(true) /* shows all video previews */
        .showPredictionPoints(true) /* shows a square every 100 milliseconds where current prediction is */
        .applyKalmanFilter(true); /* Kalman Filter defaults to on. Can be toggled by user. */

    var checkExist = setInterval(function () {
        // Once the eye location div is loaded, show calibration or test
        if (document.getElementById('webgazerGazeDot')) {
            setTimeout(() => {
                console.log('Webgazer Loaded!');
                // turn off loading wheel
                grid.loading(false, div);
                // make the grid
                grid.makeGrid();
                // init calibration
                grid.calibrate(cells, div)
            }, 3000);
            // clear interval, so only one calibration event is loaded
            clearInterval(checkExist);
        }
    }, 100);
})(webgazer, gridBuilder);
