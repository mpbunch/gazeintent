// mb_util is in progress, and kind of a mess
// much more work needs to be done before it is ... readable, useable, etc
import { doGaze } from "./mb_util.js";

(function () {
    let gaze = new doGaze();
    // Show loading wheel wile webgazer is being loaded
    gaze.loading();
    // wait for webgazer before calibration grid load
    var checkExist = setInterval(function () {
        // Once the eye location div is loaded, show calibration or test
        if (document.getElementById('webgazerGazeDot')) {
            // turn off loading wheel
            gaze.loading(false);
            // init calibration
            let calibrate = gaze.calibrate();
            // start calibration
            calibrate.start();
            // clear interval, so only one calibration event is loaded
            clearInterval(checkExist);
        }
    }, 100);
})(doGaze);