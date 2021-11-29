// edited copy of mb_utils
// for client test grid, cells and symbols
// work in progress, much yet to do
export class doGazeTest {
    constructor(...grid) {
        this.grid = grid
    }

    #makeGrid = (gridSize, type = 'test') => {
        console.log('Make Grid');
        console.log(gridSize);
        const grid = document.querySelector('#gazeGrid');

        if (grid) {
            console.log('----------------ML_UTIL - GRID');
            for (let i = 1; i <= gridSize; ++i) {
                this.element = document.createElement('div');
                this.element.className = 'gazeCell';
                this.element.id = i;

                if (type === 'calibrate') {
                    console.log('calibration')

                    this.center_element = document.createElement('button');
                    this.center_element.className = 'gazeCellCalibrate btn btn-primary btn-sm';
                    this.center_element.innerHTML = '<i class="bi bi-check-lg"></i>';
                    this.center_element.id = `cell-btn-${i}`;
                    this.center_element.disabled = true;


                    this.center_element.addEventListener('click', () => {
                        console.log('Click');
                        console.log(document.getElementById(`cell-btn-${i}`), i)
                        let btn = document.getElementById(`cell-btn-${i}`);
                        btn.setAttribute('style', 'background-color:red;')
                    });
                }

                if (type === 'test') {
                    console.log('----------------ML_UTIL - TYPE==TEST')

                    this.center_element = document.createElement('div');
                    this.center_element.className = 'clientTestSymbolDiv';
                    this.center_element.innerHTML = '<b>Symbol Placeholder</b>';
                    this.center_element.id = `client-test-div-${i}`;
                    this.center_element.disabled = true;


                    this.center_element.addEventListener('click', () => {
                        console.log('Click');
                        console.log(document.getElementById(`client-test-div-${i}`), i)
                        let clientTestDiv = document.getElementById(`client-test-div-${i}`);
                        clientTestDiv.setAttribute('style', 'background-color:red;')
                    });
                }

                this.element.append(this.center_element);
                grid.appendChild(this.element);
            }
        } else {
            console.log('No div with id gazeGrid found.')
        }
    }

    loading = (waiting = true) => {
        // wait for webgazer to fully load
        if (waiting) {
            console.log('loading now')
            const grid = document.querySelector('#gazeGrid');
            let loading = document.createElement('div');
            loading.id = 'webgazerLoading';
            loading.innerHTML = '<div id="webgazerLoading"><div class="spinner-box"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></div></div>';
            grid.append(loading);
        } else {
            console.log('done loading now')
            let loading = document.getElementById('webgazerLoading');
            if (loading) loading.remove()
        }
    }

    calibrate = (gridSize = 9) => {
        console.log('Calibration');
        var helpers = {}
        // Make calibration Grid
        if (gridSize) this.#makeGrid(gridSize);
        let accuracy = document.createElement('div');
        accuracy.id = 'accuracy'
        document.getElementById('gazeGrid').parentElement.append(accuracy)
        // Define calibration start function
        const start = (cellId = 1) => {
            helpers.advance(cellId);
            console.log('Calibration Start');
        };

        // Define calibration stop funciton
        const end = () => {
            console.log('Calibration Stop');
        };

        helpers.compare = (target, tracker) => {

        }

        // Define calibration advance function
        helpers.advance = (cellId) => {
            console.log('ADVANCE')
            let elements = document.getElementsByClassName('gazeCell');
            Array.from(elements).forEach(element => {
                let button = element.getElementsByTagName('button')[0];
                button.disabled = true;
                if (element.id == cellId) button.disabled = false;
            });
        }

        return { start: start, end: end }
    }

    test = (gridSize = 9) => {
        console.log('test');
        var helpers = {}
        // Make calibration Grid
        if (gridSize) this.#makeGrid(gridSize);
        let accuracy = document.createElement('div');
        accuracy.id = 'accuracy'
        document.getElementById('gazeGrid').parentElement.append(accuracy)
        // Define calibration start function
        const start = (cellId = 1) => {
            helpers.advance(cellId);
            console.log('Calibration Start');
        };

        // Define calibration stop funciton
        const end = () => {
            console.log('Calibration Stop');
        };

        helpers.compare = (target, tracker) => {

        }

        // Define calibration advance function
        helpers.advance = (cellId) => {
            console.log('ADVANCE')
            let elements = document.getElementsByClassName('gazeCell');
            Array.from(elements).forEach(element => {
                let button = element.getElementsByTagName('button')[0];
            });
        }

        return { start: start, end: end }
    }

}

export function calibrateAdvance(id) {
    // Click event will change to 'red dot event'
    // let calibrated = false;
    // let calibrateCount = 0;
    // let dot = document.getElementById('webgazerGazeDot');
    // let target = document.getElementById(id)
    // while (!calibrated) {
    //     console.log(calibrateCount)
    //     if (calibrateCount > 5) calibrated = overlaps(source, dot)
    //     calibrateCount += 1
    // }
    // let elements = document.getElementsByClassName('gazeCell');
    // Array.from(elements).forEach(element => {
    //     let button = element.getElementsByTagName('button')[0];
    //     button.disabled = true;
    //     if (element.id == id) button.disabled = false;
    // });
}

function calibrateDestory() {
    // Maybe a calibration complete message
    // and then destroy
    // .. will also need to do something about the overflow:hidden (no scroll)
    document.getElementById('gazeContainer').innerHTML = '<h3>Calibration Complete</h3>'
}



/*
 * Sets store_points to true, so all the occuring prediction
 * points are stored
 */
function store_points_variable() {
    webgazer.params.storingPoints = true;
}

/*
 * Sets store_points to false, so prediction points aren't
 * stored any more
 */
function stop_storing_points_variable() {
    webgazer.params.storingPoints = false;
}

/**
* This function occurs on resizing the frame
* clears the canvas & then resizes it (as plots have moved position, can't resize without clear)
*/
function resize() {
    var canvas = document.getElementById('client-test');
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};
window.addEventListener('resize', resize, false);

/*
 * This function calculates a measurement for how precise
 * the eye tracker currently is which is displayed to the user
 */
function calculatePrecision(past50Array) {
    var windowHeight = window.innerHeight;
    var windowWidth = window.innerWidth;

    // Retrieve the last 50 gaze prediction points
    var x50 = past50Array[0];
    // offset for header height
    var y50 = past50Array[1] - 30;

    // Calculate the position of the point the user is staring at
    var staringPointX = windowWidth / 2;
    var staringPointY = windowHeight / 2;

    var precisionPercentages = new Array(50);
    calculatePrecisionPercentages(precisionPercentages, windowHeight, x50, y50, staringPointX, staringPointY);
    var precision = calculateAverage(precisionPercentages);

    // Return the precision measurement as a rounded percentage
    return Math.round(precision);
};

/*
 * Calculate percentage accuracy for each prediction based on distance of
 * the prediction point from the centre point (uses the window height as
 * lower threshold 0%)
 */
function calculatePrecisionPercentages(precisionPercentages, windowHeight, x50, y50, staringPointX, staringPointY) {
    for (let x = 0; x < 50; x++) {
        // Calculate distance between each prediction and staring point
        var xDiff = staringPointX - x50[x];
        var yDiff = staringPointY - y50[x];
        var distance = Math.sqrt((xDiff * xDiff) + (yDiff * yDiff));

        // Calculate precision percentage
        var halfWindowHeight = windowHeight / 2;
        var precision = 0;
        if (distance <= halfWindowHeight && distance > -1) {
            precision = 100 - (distance / halfWindowHeight * 100);
        } else if (distance > halfWindowHeight) {
            precision = 0;
        } else if (distance > -1) {
            precision = 100;
        }

        // Store the precision
        precisionPercentages[x] = precision;
    }
}

/*
 * Calculates the average of all precision percentages calculated
 */
function calculateAverage(precisionPercentages) {
    var precision = 0;
    for (let x = 0; x < 50; x++) {
        precision += precisionPercentages[x];
    }
    precision = precision / 50;
    return precision;
}

/**
 * Restart the calibration process by clearing the local storage and reseting the calibration point
 */
function Restart() {
    document.getElementById("Accuracy").innerHTML = "<a>Not yet Calibrated</a>";
    webgazer.clearData();
    ClearCalibration();
    PopUpInstruction();
}

/**
 * Show the Calibration Points
 */
function ShowCalibrationPoint() {
    $(".Calibration").show();
    $("#Pt5").hide(); // initially hides the middle button
}

/**
* This function clears the calibration buttons memory
*/
function ClearCalibration() {
    // Clear data from WebGazer

    $(".Calibration").css('background-color', 'red');
    $(".Calibration").css('opacity', 0.2);
    $(".Calibration").prop('disabled', false);

    CalibrationPoints = {};
    PointCalibrate = 0;
}

// sleep function because java doesn't have one, sourced from http://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}


var overlaps = (function () {
    function getPositions(elem) {
        var pos, width, height;
        pos = elem.getBoundingClientRect();
        width = elem.offsetWidth / 2;
        height = elem.offsetHeight;
        return [[pos.left, pos.left + width], [pos.top, pos.top + height]];
    }

    function comparePositions(p1, p2) {
        console.log(p1, p2);
        var r1, r2;
        r1 = p1[0] < p2[0] ? p1 : p2;
        r2 = p1[0] < p2[0] ? p2 : p1;
        return r1[1] > r2[0] || r1[0] === r2[0];
    }

    return function (a, b) {
        var elem_a, elem_b;
        elem_a = document.getElementById(a);
        elem_b = document.getElementById(b);
        if (!elem_a || !elem_b) return false
        var pos1 = getPositions(elem_a),
            pos2 = getPositions(elem_b);
        return comparePositions(pos1[0], pos2[0]) && comparePositions(pos1[1], pos2[1]);
    };
})();
