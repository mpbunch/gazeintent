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

            // this.element.append(this.center_element);
            grid.appendChild(this.element);
        }

        // return div so you can do other stuff with it
        return document.querySelector(`#${div}`);
    }

    calibrate = (cells = 9, div = 'gazeGrid') => {
        const grid = document.querySelector(`#${div}`);
        /*
            for each cell, record 5 calibration events
                after 5th event, move to next cell
                after all cells have been completed
                    check overall calibration
        */
        // if (!loc.length) return
        var count, n, elem;
        n = 3;
        const timer = ms => new Promise(res => setTimeout(res, ms))
        async function load() { // We need to wrap the loop into an async function for this to work
            for (var i = 1; i <= cells; ++i) {
                count = 0;
                console.log('loop:', i, cells)
                elem = document.getElementById(`gaze-${i}`);
                elem.innerHTML = `Look Here For ${n} seconds.`;
                var rect = elem.getBoundingClientRect();
                var clicker = setInterval(function () {
                    console.log('click')
                    document.elementFromPoint(rect.x, rect.y).click();
                    if (count == n) clearInterval(clicker)
                    count++;
                }, n * 1000 / 5)
                await timer(n * 1000); // then the created Promise can be awaited
                elem.innerHTML = ''
            }
        }
        load()
    }

    loading = (waiting = true, div = 'gazeGrid') => {
        // wait for webgazer to fully load
        if (waiting) {
            console.log('loading')
            const grid = document.querySelector(`#${div}`);
            let loading = document.createElement('div');
            loading.id = 'webgazerLoading';
            loading.innerHTML = '<div id="webgazerLoading"><div class="spinner-box"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></div></div>';
            grid.append(loading);
        } else {
            console.log('not loading')
            let loading = document.getElementById('webgazerLoading');
            if (loading) loading.remove()
        }
    }
}

export class calibrate {

}