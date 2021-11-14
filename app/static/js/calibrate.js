import { doGaze } from "./mb_util.js";

(function () {
    // wait for webgazer before calibration grid load
    let gaze = new doGaze();
    gaze.loading();
    var checkExist = setInterval(function () {
        if (document.getElementById('webgazerGazeDot')) {
            console.log('Webgazer Loaded!')
            gaze.loading(false);
            let calibrate = gaze.calibrate();
            calibrate.start();
            // calibrate.advance(1);
            clearInterval(checkExist);
        }
    }, 100);
    // gaze.test();
})(doGaze);