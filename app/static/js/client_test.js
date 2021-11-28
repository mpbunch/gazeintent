
// ml_util is work in progress
// copied and edited from mb_utils

import { doGazeTest } from "./ml_util.js";

(function () {
    let gaze = new doGazeTest();
    console.log('client_test - new doGazeTest');
    // Show loading wheel wile webgazer is being loaded
    gaze.loading();
    // wait for webgazer before calibration grid load
    var checkExist = setInterval(function () {
        // Once the eye location div is loaded, show calibration or test
        if (document.getElementById('webgazerGazeDot')) {
            console.log('client_test - Webgazer Loaded!');
            // turn off loading wheel
            gaze.loading(false);
            // init test
            let test = gaze.test();
            console.log('client_test - starting test now')
            // start test
            test.start();
            // clear interval, so only one test event is loaded
            clearInterval(checkExist);
        }
    }, 100);
})(doGazeTest);