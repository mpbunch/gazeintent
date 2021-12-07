export class gridBuilder {
    makeGrid = (cells = 9, type = 'calibrate', div = 'gazeGrid') => {
        // Default values
        // cells = number of cells/zones
        // type = calibrate or test
        // div = the div for which you wish the grid to be appended
        const grid = document.querySelector(`#${div}`);

        // If div not found return nothing
        if (!grid) return

        // create each cell/zone
        for (let i = 1; i <= cells; ++i) {
            this.element = document.createElement('div');
            this.element.className = 'gaze-cell';
            this.element.id = `gaze-${i}`;
            this.element.dataset.cell = i;
            this.element.dataset.gazed = 0;
            this.element.dataset.position = '0,0,0,0';
            if (i == 1) {
                this.element.classList.add('active-cell');
                this.element.innerHTML = `Look Here, Hold Your Gaze.`;
            }
            // this.element.append(this.center_element);
            grid.appendChild(this.element);
        }

        let gridCells = document.querySelectorAll('.gaze-cell')
        Array.from(gridCells).map(elem => {
            let position = this.get_position(elem);
            elem.dataset.position = position
        })
        // return div so you can do other stuff with it
        let accuracy = document.createElement('div');
        accuracy.classList.add('accuracy')
        accuracy.id = 'accuracy'
        grid.append(accuracy)
        return document.querySelector(`#${div}`);
    }

    test = () => {
        return "test"
    }

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

    accuracy = () => {
        // sleep function because javascript doesn't have one, sourced from http://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
        function sleep(time) {
            return new Promise((resolve) => setTimeout(resolve, time));
        }
        /*
         * This function calculates a measurement for how precise 
         * the eye tracker currently is which is displayed to the user
         */
        function calculatePrecision(past50Array) {
            var windowHeight = window.innerHeight;
            var windowWidth = window.innerWidth;

            // Retrieve the last 50 gaze prediction points
            var x50 = past50Array[0];
            var y50 = past50Array[1];

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

        store_points_variable(); // start storing the prediction points
        var end = Date.now()
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
    }

    reset = () => {
        webgazer.clearData();
    }

    advance = (activeCell, grid_cells) => {
        // we need to identify calibration sequence
        let sequence = { 1: 2, 2: 3, 3: 4, 4: 6, 5: 0, 6: 7, 7: 8, 8: 9, 9: 5 }
        // active cell clean up
        activeCell.classList.remove('active-cell');
        activeCell.innerHTML = ''

        // next cell setup
        let next = parseInt(activeCell.dataset.cell);
        if (sequence[next] && next <= grid_cells) {
            let next_cell = document.querySelector(`#gaze-${sequence[next]}`)
            next_cell.classList.add('active-cell');
            next_cell.innerHTML = `Look Here, Hold Your Gaze.`;
        } else {
            this.accuracy()
        }
    }

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

    loading = (waiting = true, div = 'gazeGrid') => {
        // wait for webgazer to fully load
        if (waiting) {
            const grid = document.querySelector(`#${div}`);
            let loading = document.createElement('div');
            loading.id = 'webgazerLoading';
            loading.innerHTML = '<div id="webgazerLoading"><div class="spinner-box"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></div></div>';
            grid.append(loading);
        } else {
            let loading = document.getElementById('webgazerLoading');
            if (loading) loading.remove()
        }
    }

}